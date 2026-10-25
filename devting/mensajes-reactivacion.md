# Mensajes de reactivación · plantillas listas para usar

> RAMNCO · Recuperación de clientes sobre cartera antigua
> Acompaña a [`guion-venta-reactivacion.md`](guion-venta-reactivacion.md).
>
> **Marcadores**: `{{nombre}}` · `{{empresa}}` · `{{producto}}` · `{{oferta}}` · `{{fecha_compra}}` · `{{ejecutivo}}` · `{{telefono_respuesta}}`
> **Regla de oro:** máximo 3 intentos por persona, en franjas razonables (lunes a viernes 10:00–13:00 y 15:00–19:00), y siempre con opción de baja.

---

## 1. WhatsApp

### Caso A · Compró hace ~6 meses (recuperación temprana)

**Intento 1**
```
Hola {{nombre}}, soy {{ejecutivo}} de {{empresa}}.
Vi que te llevaste {{producto}} hace unos meses y quería avisarte que
de nuevo tenemos disponible lo que usabas.
¿Te hago el pedido como la vez anterior?
```

**Seguimiento 1 (a los 3 días)**
```
Hola {{nombre}}, quedo atento por si necesitas reponer {{producto}}.
Si prefieres, te lo dejo reservado y lo retiras cuando te acomode.
```

**Seguimiento 2 (a los 7 días)**
```
{{nombre}}, no quiero insistir más. Si {{oferta}} te sirve, avísame
hoy y lo coordinamos. Si prefieres no recibir estos mensajes, dime
"no" y te quito de la lista.
```

### Caso B · Compró hace ~1 año (recuperación profunda)

**Intento 1**
```
Hola {{nombre}}, soy {{ejecutivo}} de {{empresa}}.
La última vez que nos compraste fue en {{fecha_compra}} y desde
entonces cambiaron algunas cosas. Quería contarte qué hay ahora
que no existía cuando nos viste.
¿Te llamo esta semana o te mando un resumen por acá?
```

**Seguimiento 1**
```
{{nombre}}, te dejo el resumen que te mencioné: {{oferta}}.
Si prefieres verlo en persona, tengo cupos el jueves o viernes.
```

**Seguimiento 2**
```
Último mensaje de mi parte, {{nombre}}. Si más adelante te sirve,
aquí estoy. Si quieres que no te escriba más, dímelo y lo respeto.
```

### Caso C · Cotizó y no compró

**Intento 1**
```
Hola {{nombre}}, soy {{ejecutivo}} de {{empresa}}.
Hace un tiempo te pasamos una cotización por {{producto}} y
quedó pendiente. ¿La retomamos? Puedo actualizarte el valor
con las condiciones de hoy.
```

**Seguimiento 1**
```
{{nombre}}, ¿te sirve si te mando la cotización actualizada para
que compares con calma? Sin compromiso.
```

**Seguimiento 2**
```
{{nombre}}, cierro el tema por mi parte. Si en algún momento lo
necesitas, escríbeme directo a este número.
```

---

## 2. Correo

### Caso A · Compró hace ~6 meses

**Asunto:** `{{nombre}}, ¿te falta reponer {{producto}}?`

```
Hola {{nombre}}:

Soy {{ejecutivo}} de {{empresa}}. La última vez que te llevaste
{{producto}} fue en {{fecha_compra}}.

Te escribo porque tenemos de nuevo lo que usabas y, por ser cliente,
accedes a {{oferta}}. Si quieres retomar con el mismo pedido de antes,
responde este correo y lo dejo listo.

¿Te sirve que te llame esta semana?

Saludos,
{{ejecutivo}}
{{empresa}} · {{telefono_respuesta}}
```

### Caso B · Compró hace ~1 año

**Asunto:** `Cambió {{empresa}}. Esto es lo nuevo para ti`

```
Hola {{nombre}}:

Hace un año que no nos vemos por acá. En ese tiempo cambiamos
varias cosas que te pueden servir: {{oferta}}.

Si te hace sentido, te mando el detalle en cinco líneas y decides.
Y si ya no te interesa, responde "baja" y no te volvemos a escribir.

Un gusto saludarte,
{{ejecutivo}}
{{empresa}} · {{telefono_respuesta}}
```

### Caso C · Cotizó y no compró

**Asunto:** `Tu cotización de {{producto}} quedó pendiente`

```
Hola {{nombre}}:

Quedó pendiente la cotización de {{producto}} que te enviamos hace
un tiempo. Te adjunto el valor actualizado, con las condiciones de hoy.

Si el motivo por el que no avanzamos era el precio o el plazo,
cuéntame cuál era y lo revisamos juntos.

Saludos,
{{ejecutivo}}
{{empresa}} · {{telefono_respuesta}}
```

---

## 3. Llamada telefónica

**Apertura (si atendió la misma persona que compró)**
```
Buenos días {{nombre}}, le habla {{ejecutivo}} de {{empresa}}.
Le llamo porque usted nos compró {{producto}} hace un tiempo y
quedó pendiente una conversación. ¿Tiene dos minutos?
```

**Si pregunta «¿quién habla?» o «¿de qué se trata?»**
```
De {{empresa}}, la misma con la que compró {{producto}} el
{{fecha_compra}}. No es nada negativo: quería contarle {{oferta}}
y ver si le sirve.
```

**Si dice «no me interesa»**
```
Entendido, gracias por decírmelo. Le dejo mi contacto por si más
adelante le sirve, y no lo vuelvo a llamar. Que tenga buen día.
```

**Si dice «estoy ocupado»**
```
Sin problema. ¿Le parece si le escribo por WhatsApp y me responde
cuando pueda? Así no lo molesto.
```

**Regla:** si en la llamada obtienes «sí, me interesa» → agenda de inmediato día y hora. No dejes «te llamo después».

---

## 4. Reglas de contacto (obligatorias para todo el equipo)

| Regla | Detalle |
|---|---|
| **Máximo 3 intentos** | Después del tercero, el contacto pasa a «descartado» y no se vuelve a contactar. |
| **Franja horaria** | Lunes a viernes, 10:00–13:00 y 15:00–19:00. Nada de domingos ni feriados. |
| **Baja inmediata** | Si alguien dice «no», «baja», «no me escriban más»: se marca en el panel y se excluye de toda campaña futura. |
| **Mensaje pertinente** | Nunca mandes una oferta que no tenga relación con lo que esa persona compró. |
| **No usar canales que no pidió** | Si el cliente pidió contacto solo por correo, no escribirle por WhatsApp. |
| **Respuesta antes que venta** | Si pregunta por stock, horario o precio, primero se responde eso. |

---

## 5. Qué **no** decir

- ❌ «Estimado cliente corporativo» / «Su distinguida preferencia» → suena a robot.
- ❌ «Sabemos que nos extraña» / «Te echamos de menos» → no es una razón.
- ❌ «Oferta válida solo hoy» si no es verdadera.
- ❌ «Le ofrecemos un 50% de descuento» sin que la empresa lo haya autorizado.
- ❌ «Este es el último aviso» en el segundo intento (quedas sin tercero).
- ❌ Cualquier promesa de resultado («recuperamos a todos»).
- ❌ Escribir a contactos que nunca compraron ni pidieron información: eso no es reactivación, es lista comprada.
