import api from "../../../lib/axios";
import { SoVChart } from "../../../components/SoVChart";

export default async function ShareOfVoicePage() {
  // const res = await api.get<any[]>("/analytics/share-of-voice");
  return (
    <section className="p-6 space-y-6">
      <h1 className="text-xl font-bold">Share of Voice by Source</h1>

      <div className="bg-white border rounded p-4">
        {/* <SoVChart data={res.data} /> */}
      </div>
    </section>
  );
}
