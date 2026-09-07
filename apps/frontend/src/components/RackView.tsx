import type {Device} from '../types/device'

interface RackViewProps {
  devices: Device[];
}

const statusColors: Record<string, string> = {
  ONLINE: "bg-green-700",
  DEGRADED: "bg-amber-500",
  OFFLINE: "bg-red-700",
};

// BUILD RACK MAP

function buildRackMap(devices: Device[]) {
  const rack: (Device | null)[] = Array(42).fill(null);

  devices.forEach((device) => {
    if (device.rackUnit === null || device.rackSize === null) {
      return;
    }

    const startIndex = device.rackUnit - 1;

    for (let i = 0; i < device.rackSize; i++) {
      const index = startIndex + i;

      if (index >= 0 && index < 42) {
        rack[index] = device;
      }
    }
  });

  return rack;
}

// COMPONENT

export default function RackView({ devices }: RackViewProps) {
  const rackMap = buildRackMap(devices);

  return (
    <div
      className="
        w-full
        max-w-xl
        rounded-lg
        border border-slate-800
        bg-slate-900
        p-4
      "
    >
      {/* HEADER */}

      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">Rack View</h2>

        <p className="mt-1 text-sm text-slate-500">42U Equipment Rack</p>
      </div>

      {/* RACK */}

      <div
        className="
          overflow-hidden
          rounded-md
          border-2 border-slate-700
          bg-slate-950
        "
      >
        {rackMap
          .map((device, index) => ({
            device,
            index,
          }))
          .map(({ device, index }) => {
            const unitNumber = index + 1;

            const isFirstSlot =
              device !== null &&
              device.rackUnit !== null &&
              device.rackUnit - 1 === index;

            return (
              <div
                key={index}
                className="
                  flex
                  h-8
                  border-b border-slate-800
                  last:border-b-0
                "
              >
                {/* UNIT NUMBER */}

                <div
                  className="
                    flex
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    border-r border-slate-700
                    bg-slate-950
                    font-mono
                    text-xs
                    text-slate-500
                  "
                >
                  U{unitNumber}
                </div>

                {/* EMPTY SLOT */}

                {device === null ? (
                  <div
                    className="
                      flex-1
                      bg-slate-900/50
                    "
                  />
                ) : (
                  /* DEVICE */

                  <div
                    className={`
                      flex
                      flex-1
                      items-center
                      px-3
                      text-xs
                      font-medium
                      text-white
                      ${statusColors[device.status] ?? "bg-slate-700"}
                    `}
                  >
                    {isFirstSlot && (
                      <div
                        className="
                          flex
                          w-full
                          items-center
                          justify-between
                        "
                      >
                        <span>{device.name}</span>

                        <span
                          className="
                            text-[10px]
                            uppercase
                            opacity-70
                          "
                        >
                          {device.type.replaceAll("_", " ")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
