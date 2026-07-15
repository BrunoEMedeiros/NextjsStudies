import UsersTable from "@/src/components/UsersTable/UsersTable";

export default function MembersPage() {
  return (
    <div className="flex flex-col justify-center pb-20">
      <div className="flex w-full justify-center items-center text-2xl text-white mb-10">
        Membros
      </div>
      <div className="flex justify-center items-center">
        <UsersTable />
      </div>
    </div>
  );
}
