export type ConnectorInput = {
    queryText: string;
};

export type ConnectorOutput = {
    raw_text: string;
    metadata: Record<string, any>;
    screenshot_path?: string;
};

export interface SourceConnector {
    fetch(input: ConnectorInput): Promise<ConnectorOutput>;
}
