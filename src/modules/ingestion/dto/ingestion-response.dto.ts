export class IngestionResponseDto {
  source: string;
  type: "weather" | "traffic" | "news";
  value: any;
  timestamp: Date;
}
