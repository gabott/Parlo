import { useState } from "react";
import { Button, Feedback } from "../../design-system";
import { useGuestLearner } from "./useGuestLearner";

export function LocalProgressPanel() {
  const { repository, enrollment, loading, error, refresh } = useGuestLearner();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [notice, setNotice] = useState<string>();
  const start = async () => { try { await repository.startA1(); await refresh(); setNotice("A1 started. Your progress will stay on this device."); } catch { setNotice("A1 could not be saved on this device. The course preview remains available."); } };
  const exportData = async () => { const data = await repository.exportProgress(); const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })); const link = document.createElement("a"); link.href = url; link.download = "parlo-local-progress.json"; link.click(); URL.revokeObjectURL(url); setNotice("Local progress export created."); };
  const remove = async () => { await repository.deleteLocalProgress(); setConfirmingDelete(false); setNotice("Local progress deleted from this device."); await refresh(); };
  if (loading) return <p role="status">Checking local progress…</p>;
  return <section className="local-progress" aria-labelledby="local-progress-title">
    <div><p className="learn-preview-kicker">Private guest progress</p><h2 id="local-progress-title">{enrollment ? "A1 is active on this device" : "Ready to start A1?"}</h2><p>{enrollment ? "Your lesson attempts and progress are stored only in this browser." : "Start explicitly to save lesson progress locally. No account is required."}</p></div>
    {error && <Feedback title="Storage unavailable" tone="error">{error}</Feedback>}
    {!enrollment && !error && <Button onClick={start}>Start A1</Button>}
    {enrollment && <div className="local-progress__actions"><Button variant="secondary" onClick={exportData}>Export progress</Button>{!confirmingDelete ? <Button variant="secondary" onClick={() => setConfirmingDelete(true)}>Delete local progress</Button> : <div className="local-progress__confirm" role="group" aria-label="Confirm local progress deletion"><strong>Delete all progress on this device?</strong><Button onClick={remove}>Yes, delete</Button><Button variant="secondary" onClick={() => setConfirmingDelete(false)}>Cancel</Button></div>}</div>}
    {notice && <Feedback title="Local progress" tone="info">{notice}</Feedback>}
  </section>;
}
