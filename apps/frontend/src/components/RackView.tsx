import { useState } from "react";
import type { ReactNode } from "react";

import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

import type { DragEndEvent } from "@dnd-kit/core";

import type { Device } from "../types/device";

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

// DROPPABLE SLOT

function RackSlot({
  unitNumber,
  children,
}: {
  unitNumber: number;
  children: ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `unit-${unitNumber}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        flex
        h-8
        border-b border-slate-800
        last:border-b-0
        transition
        ${isOver ? "bg-cyan-500/20" : ""}
      `}
    >
      {children}
    </div>
  );
}

// DRAGGABLE DEVICE

function DraggableDevice({ device }: { device: Device }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: device.id,
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,

    opacity: isDragging ? 0.5 : 1,

    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`
        flex
        h-full
        flex-1
        cursor-grab
        items-center
        justify-between
        px-3
        text-xs
        font-medium
        text-white
        active:cursor-grabbing
        ${statusColors[device.status] ?? "bg-slate-700"}
      `}
    >
      <span>{device.name}</span>

      <span className="text-[10px] uppercase opacity-70">
        {device.type.replaceAll("_", " ")}
      </span>
    </div>
  );
}

// COMPONENT

export default function RackView({ devices }: RackViewProps) {
  const [localDevices, setLocalDevices] = useState<Device[]>(devices);
  const rackMap = buildRackMap(localDevices);
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      return;
    }
    const deviceId = String(active.id);
    const targetId = String(over.id);
    if (!targetId.startsWith("unit-")) {
      return;
    }

    const targetUnit = Number(targetId.replace("unit-", ""));
    const movingDevice = localDevices.find((device) => device.id === deviceId);

    if (!movingDevice) {
      return;
    }

    if (movingDevice.rackSize === null) {
      return;
    }

    // CHECK RACK LIMIT

    const targetEnd = targetUnit + movingDevice.rackSize - 1;

    if (targetUnit < 1 || targetEnd > 42) {
      return;
    }

    // CHECK OVERLAP

    const hasConflict = localDevices.some((device) => {
      if (device.id === movingDevice.id) {
        return false;
      }

      if (device.rackUnit === null || device.rackSize === null) {
        return false;
      }
      const existingStart = device.rackUnit;
      const existingEnd = device.rackUnit + device.rackSize - 1;
      return targetUnit <= existingEnd && targetEnd >= existingStart;
    });

    if (hasConflict) {
      console.log("Rack units are occupied");
      return;
    }

    // UPDATE LOCAL POSITION

    setLocalDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId
          ? {
              ...device,
              rackUnit: targetUnit,
            }
          : device,
      ),
    );

    console.log(`${movingDevice.name} moved to U${targetUnit}`);
  };

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

      <DndContext onDragEnd={handleDragEnd}>
        <div
          className="
          max-h-80
          overflow-y-auto
            rounded-md
            border-2
            border-slate-700
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
                <RackSlot key={unitNumber} unitNumber={unitNumber}>
                  {/* UNIT NUMBER */}

                  <div
                    className="
                      flex
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      border-r
                      border-slate-700
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
                  ) : isFirstSlot ? (
                    // DEVICE

                    <DraggableDevice device={device} />
                  ) : (
                    // OCCUPIED PART OF MULTI-U DEVICE

                    <div
                      className={`
                        flex-1
                        ${statusColors[device.status] ?? "bg-slate-700"}
                      `}
                    />
                  )}
                </RackSlot>
              );
            })}
        </div>
      </DndContext>
    </div>
  );
}
