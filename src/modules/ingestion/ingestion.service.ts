import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IngestionRepository } from './ingestion.repository';
import * as crypto from 'crypto';
import { IngestionResponseDto } from './dto/ingestion-response.dto';

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly ingestionRepository: IngestionRepository,
  ) {}

  async fetchAndProcessAll(): Promise<IngestionResponseDto[]> {
    const fetchers = [
      this.fetchWithRetry('weather', 'https://mock-weather-api.example.com/data'),
      this.fetchWithRetry('news', 'https://mock-news-api.example.com/data'),
      this.fetchWithRetry('traffic', 'https://mock-traffic-api.example.com/data'),
    ];

    const results = await Promise.all(fetchers);
    return results.filter((res) => res !== null) as IngestionResponseDto[];
  }

  async fetchWithRetry(type: string, url: string, retries: number = 3): Promise<IngestionResponseDto> {
    let attempt = 0;
    let delay = 1000; // 1s base delay for exponential backoff

    while (attempt < retries) {
      try {
        const response = await firstValueFrom(this.httpService.get(url, { timeout: 5000 }));
        const value = response?.data || { status: 'ok', mocked: true, data: `Mock data for ${type} (Attempt ${attempt + 1})` };
        this.logger.log(`Successfully fetched ${type} data from ${url}`);

        return await this.processData(type, url, value);
      } catch (error) {
        attempt++;
        this.logger.warn(`Failed to fetch ${type} data from ${url}. Attempt ${attempt} of ${retries}. Error: ${error.message}`);
        
        if (attempt >= retries) {
          this.logger.error(`Max retries reached for ${type} at ${url}. Returning fallback data.`);
          // Fallback data returned so server doesn't crash on failure
          return await this.processData(type, url, { status: 'fallback', error: true, data: `Fallback data for ${type}` });
        }
        
        // Wait before next retry
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff scaling
      }
    }
    
    // Fallback if loop cleanly exits without returning
    return await this.processData(type, url, { status: 'fallback', data: `Ultimate fallback for ${type}` });
  }

  private async processData(type: string, url: string, rawData: any): Promise<IngestionResponseDto> {
    // Handle null/undefined gracefully
    const value = rawData || {};
    const timestamp = new Date();
    
    // Prevent duplicate entries by hashing the payload content
    const hashContent = JSON.stringify({ type, source: url, value });
    const hash = crypto.createHash('sha256').update(hashContent).digest('hex');

    const normalizedData = {
      source: url,
      type,
      value,
      timestamp,
      hash,
    };

    // Store in Postgres, preventing duplicate errors
    await this.ingestionRepository.save(normalizedData);
    
    return {
      source: normalizedData.source,
      type: normalizedData.type as "weather" | "traffic" | "news",
      value: normalizedData.value,
      timestamp: normalizedData.timestamp,
    };
  }

  async getHistory() {
    return this.ingestionRepository.getHistory(50);
  }
}
