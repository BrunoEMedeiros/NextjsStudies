"use client";

import { useState } from "react";
import ActivityContainer from "@/src/components/ActivitiesContainer/ActivitiesContainer";
import NewActivityForm from "@/src/components/NewActivityForm/NewActivityForm";
import { ActivityDetails } from "@/src/lib/service/activity.service";

export default function ActivityPage() {
  const [editingActivity, setEditingActivity] =
    useState<ActivityDetails | null>(null);

  return (
    <div className="flex flex-col pb-20">
      <div className="flex w-full justify-center items-center text-2xl text-earth-yellow mb-10">
        <NewActivityForm
          editingActivity={editingActivity}
          onEditComplete={() => setEditingActivity(null)}
        />
      </div>
      <div className="flex justify-center">
        <ActivityContainer onEdit={setEditingActivity} />
      </div>
    </div>
  );
}
