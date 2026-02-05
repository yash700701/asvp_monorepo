export type ConnectorInput = {
    queryText: string;
    queryType: "brand" | "category" | "competitor" | "product";
    runId: string;
    locale?: string;
};

export type ConnectorOutput = {
    raw_text: string;
    metadata: Record<string, any>;
    screenshot_path?: string;
    html_path?: string;
};

export interface SourceConnector {
    fetch(input: ConnectorInput): Promise<ConnectorOutput>;
}
