import { EventLog } from "@/hooks/UseContractEvents";

interface ContractEventsProps {
  events: EventLog[];
}

export const ContractEvents = ({ events }: ContractEventsProps) => {
  if (events.length === 0) return null;

  return (
    <div className="mt-6 p-4 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-white">Contract Events</h2>
      <div className="space-y-2">
        {events.map((event, index) => (
          <div
            key={`${event.timestamp}-${index}`}
            className="p-3 bg-gray-700 rounded"
          >
            <div className="flex justify-between text-gray-300 text-sm mb-1">
              <span className="font-semibold text-blue-400">
                {event.eventName}
              </span>
              <span>{new Date(event.timestamp).toLocaleString()}</span>
            </div>
            <div className="text-gray-100 font-mono text-sm">
              {Object.entries(event.data).map(([key, value]) => (
                <div key={key} className="grid grid-cols-[120px_1fr] gap-2">
                  <span className="text-gray-400">{key}:</span>
                  <span className="break-all">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
