import UsersTable from "@/src/components/UsersTable/UsersTable";

export default function MembersPage() {
  return (
    <div className="flex flex-col pb-20">
      <div className="flex w-full justify-center items-center text-2xl text-earth-yellow mb-10">
        Membros
      </div>
      <div className="flex justify-center">
        <UsersTable />
      </div>
    </div>
  );
}
