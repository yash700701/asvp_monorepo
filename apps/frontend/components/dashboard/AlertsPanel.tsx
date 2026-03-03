export default function AlertsPanel() {
  return (
    <Card>
      <CardHeader>Active Alerts</CardHeader>
      <CardContent>
        <AlertItem severity="high" message="Brand mentions dropped 18%" />
        <AlertItem severity="medium" message="Negative sentiment increased" />
      </CardContent>
    </Card>
  );
}