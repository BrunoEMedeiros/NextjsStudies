interface RoleBadge {
  type: string;
}

export default function RoleBadge({ type }: RoleBadge) {
  return (
    <div className="flex justify-center items-center">
      <p className="text-earth-yellow text-base">
        {type == "regular"
          ? "Membro"
          : type == "maintainer"
          ? "Mantenedor"
          : "Administrador"}
      </p>
    </div>
  );
}
