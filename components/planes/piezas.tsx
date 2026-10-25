import { IconArrowRight, IconMail } from "@/components/planes/iconos";
import { MAILTO } from "@/lib/planes";

/** Botón de correo compartido por todos los bloques. */
export function Cta({
  label = "Hablemos",
  variante = "primary",
}: {
  label?: string;
  variante?: "primary" | "ghost";
}) {
  return (
    <a className={`pl-btn pl-btn--${variante}`} href={MAILTO}>
      {variante === "primary" ? <IconMail width={17} height={17} /> : null}
      <span>{label}</span>
      <IconArrowRight width={17} height={17} />
    </a>
  );
}

/** Lista de características con marca de inclusión. */
export function Incluye({ items }: { items: readonly string[] }) {
  return (
    <ul className="pl-features">
      {items.map((item) => (
        <li className="pl-features__item" key={item}>
          <span className="pl-features__mark" aria-hidden="true">
            ✓
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
