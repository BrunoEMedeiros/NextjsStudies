import ActivityContainer from "@/src/components/ActivitiesContainer/ActivitiesContainer";
import NewActivityForm from "@/src/components/NewActivityForm/NewActivityForm";

export default function ActivityPage() {
  return (
    <div className="flex flex-col pb-20 ">
      <div className="flex w-full justify-center items-center text-2xl text-earth-yellow  mb-10">
        <NewActivityForm />
      </div>
      <div className="flex justify-center w-full">
        <ActivityContainer />
      </div>
    </div>
  );
}
