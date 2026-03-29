# -*- coding: utf-8 -*-
"""Build scripts/instr_whatif_data.json from Spanish source + googletrans (run: python build_what_if_google.py)."""
from __future__ import annotations

import json
import re
import time
from pathlib import Path

from googletrans import Translator

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "instr_whatif_data.json"

# Spanish Q/A verbatim from Lobby Instrucciones (user + docx content)
PAIRS: list[tuple[str, str]] = [
    (
        "...la vitrocerámica o placa no funciona?",
        """Antes de contactar con Inftour, por favor siga estos pasos con calma:
• PASO 1 – Comprobar si la vitrocerámica está bloqueada: En muchos casos la vitrocerámica no está averiada, sino bloqueada por seguridad. Mire atentamente el panel de control y compruebe si aparece un símbolo de candado, la letra "L" o una luz fija o parpadeante junto a estos símbolos. Para desbloquearla, mantenga el dedo pulsado de forma continua sobre el botón del candado o símbolo de bloqueo durante al menos 10 segundos, sin soltar. Espere a que el símbolo desaparezca o la vitro emita una señal y pruebe a encenderla de nuevo.
• PASO 2 – Reiniciar la electricidad de la vivienda: Si tras varios intentos sigue sin funcionar, vaya al cuadro eléctrico, apague el interruptor general, espere 1 minuto completo y vuelva a encenderlo.
• PASO 3 – Comprobar de nuevo la vitrocerámica: Después de restablecer la electricidad, la vitrocerámica puede haberse desbloqueado automáticamente o puede ser necesario repetir el PASO 1.
• IMPORTANTE: No fuerce los botones, no manipule cables ni partes internas y no utilice objetos para pulsar el panel. Si sigue sin funcionar, contacte con Inftour indicando que ya ha realizado estas comprobaciones.""",
    ),
    (
        "...la nevera o frigorífico no enfría bien?",
        """Antes de contactar con Inftour, por favor siga estos pasos con calma:
• PASO 1 – Tener en cuenta el tiempo de enfriamiento: Si el frigorífico se ha llenado completamente o se ha encendido recientemente, puede necesitar hasta 48 horas para enfriar al 100%. Durante este tiempo, utilice un nivel de frío intermedio, introduzca los alimentos poco a poco y no programe la nevera al máximo (esto no acelera el enfriamiento y puede romper el motor).
• PASO 2 – Evitar abrir la nevera con frecuencia: Mientras se enfría, procure no abrir la puerta innecesariamente.
• IMPORTANTE: No manipule el termostato interno ni fuerce el aparato. Si tras 48 horas sigue sin enfriar correctamente, contacte con Inftour.""",
    ),
    (
        "...no sale agua caliente?",
        """Antes de contactar con Inftour, por favor siga estos pasos con calma:
• PASO 1 – Comprobar que el termo está conectado: Verifique que esté correctamente enchufado a la corriente eléctrica.
• PASO 2 – Revisar interruptores desconocidos: Revise si hay algún interruptor apagado en la vivienda que controle el termo y pruebe a encenderlo.
• PASO 3 – Comprobar las luces del termo: Verifique que tiene luces encendidas o indicadores visibles.
• PASO 4 – Esperar el tiempo de calentamiento: Si se ha vaciado por uso prolongado, necesita mínimo 2 horas para volver a calentar el agua. Evite usar agua caliente en ese tiempo.
• IMPORTANTE: No manipule el termo, no toque cables ni ajustes internos. Si el problema persiste, contacte con Inftour.""",
    ),
    (
        "...el desagüe o sumidero no traga el agua?",
        """Antes de contactar con Inftour, por favor siga estos pasos con calma:
• PASO 1 – Identificar si está parcialmente obstruido: Compruebe si el agua tarda en irse pero finalmente drena (suele ser obstrucción leve por jabón o cabello).
• PASO 2 – Limpiar el sumidero visible.
• PASO 3 – Usar agua caliente: Vierta lentamente agua caliente (no hirviendo) por el desagüe para ayudar a disolver restos.
• IMPORTANTE: No utilice productos químicos agresivos, no desmonte tuberías ni introduzca objetos. Si el agua no drena, contacte con Inftour.""",
    ),
    (
        "...no hay electricidad o se fue la luz?",
        """Antes de contactar con Inftour, por favor siga estos pasos con calma:
• PASO 1 – Revisar el cuadro eléctrico: Compruebe si todas las palancas están subidas. Si alguna está bajada, súbala.
• PASO 2 – Comprobar si es problema de la vivienda o del edificio: Revise si hay luz en el portal o en otros pisos.
• 👉 CASO A (Hay luz en el edificio, pero no en su vivienda): Suele ser una sobrecarga. Desenchufe aparatos no necesarios, vaya al cuadro eléctrico, baje todas las palancas, espere 5 minutos completos y súbalas una a una con calma.
• 👉 CASO B (No hay luz en el edificio): Es un apagón general. Revise su cuadro eléctrico y notifique la situación al conserje. Contacte con Inftour para informar de la incidencia.
• IMPORTANTE: No manipule cables ni instalaciones internas. Si no se resuelve, contacte con Inftour.""",
    ),
    (
        "...el aire acondicionado no funciona?",
        """Antes de contactar con Inftour, por favor siga estos pasos con calma:
• PASO 1 – Encender el aparato: Pulse el botón ON/OFF del mando.
• PASO 2 – Seleccionar el modo correcto: Pulse el botón MODE. (❄️ COOL / copo de nieve → aire frío | ☀️ HEAT / sol → aire caliente). No debe estar en modo DRY ni FAN.
• PASO 3 – Ajustar la temperatura: En verano entre 24 °C y 26 °C; en invierno entre 20 °C y 22 °C. Evite diferencias de más de 12 °C con el exterior.
• PASO 4 – Esperar unos minutos para que empiece a emitir aire.
• PASO 5 – Comprobar mensajes de error: Si muestran letras o números, haga una foto del mando y del equipo y envíela a Inftour.
• IMPORTANTE: No manipule el aparato. Si sigue sin funcionar, contacte con nosotros enviando la foto.""",
    ),
    (
        "...el aire acondicionado gotea?",
        """Antes de contactar con Inftour, por favor siga estos pasos con calma:
• PASO 1 – Comprobar si es condensación normal: Coloque un recipiente o toalla de forma provisional y observe si el goteo es leve.
• PASO 2 – Apagar el aire acondicionado desde el mando durante unos minutos.
• PASO 3 – Encender solo en modo ventilador durante unos minutos para evacuar la humedad acumulada.
• IMPORTANTE: No abra el aparato ni intente limpiarlo por dentro. Si sigue goteando de forma constante, contacte con Inftour.""",
    ),
    (
        "...no hay internet o el WiFi no conecta?",
        """Antes de contactar con Inftour, por favor siga estos pasos con calma:
• PASO 1 – Comprobar que el router está encendido y con las luces encendidas.
• PASO 2 – Comprobar red y contraseña: Asegúrese de estar en la red correcta introduciendo la contraseña del Libro de Bienvenida.
• PASO 3 – Reiniciar el router: Desenchúfelo de la corriente, espere unos minutos y vuelva a enchufarlo.
• PASO 4 – Comprobar sus dispositivos: Si solo falla en algunos, revise la configuración de su dispositivo.
• PASO 5 – Contactar con Inftour: Si persiste, grabe un vídeo corto del router mostrando las luces y envíelo a mail@inftour.net o por WhatsApp al +34 606 376 470 / +34 640 748 732 / +34 621 292 126. Es necesario que se encuentre en la vivienda para que la compañía pueda hacer comprobaciones.""",
    ),
    (
        "...he perdido las llaves o las dejé dentro?",
        """Revise cuál de estas situaciones se aplica a su caso:
• Llaves dentro de la cerradura (puerta cerrada): Debe notificar inmediatamente a Inftour. Será necesario un servicio de cerrajero y los gastos correrán a cargo del huésped. No contacte con un cerrajero sin avisarnos antes.
• Llaves olvidadas dentro (no en la cerradura): Contacte con Inftour para que podamos facilitarle una copia.
• Llaves perdidas: El coste de sustitución y cambio de llaves correrá a cargo del huésped. Contacte con Inftour para facilitarle una copia.
• IMPORTANTE: No intente forzar la puerta ni manipular la cerradura.""",
    ),
    (
        "...un pequeño electrodoméstico (tostadora, cafetera, hervidor) no funciona o salta la luz?",
        """• No vuelva a utilizar el aparato si al enchufarlo hace que salte la electricidad y no lo pruebe en otros enchufes.
• No utilice adaptadores ni regletas.
• IMPORTANTE: Es imprescindible avisar a Inftour el mismo día de su entrada. Si el problema no se comunica, el huésped será responsable del daño. Contacte con nosotros indicando qué electrodoméstico falla y si ocurre al enchufarlo o al encenderlo.""",
    ),
    (
        "...llego tarde o fuera del horario de oficina?",
        """Si su llegada es fuera del horario de oficina, recibirá instrucciones para recoger las llaves en un box de seguridad tras completar el check-in online.""",
    ),
    (
        "...necesito saber la hora de salida (check-out)?",
        """La salida debe realizarse antes de las 11:00. Recibirá instrucciones para la devolución de llaves el día previo.""",
    ),
    (
        "...se ha acabado el papel higiénico?",
        """A su llegada, la vivienda dispone de 1 rollo de papel higiénico de cortesía. El resto de productos de uso personal y consumibles no están incluidos y deben ser adquiridos en el supermercado más cercano. Si necesita indicaciones, consúltenos.""",
    ),
    (
        "...no sé dónde tirar la basura?",
        """Hay cubos de basura en la calle cerca del edificio. Antes de su salida, es obligatorio sacar la basura del apartamento y depositarla en los contenedores correspondientes. Por favor, no deje basura dentro de la vivienda al marcharse.""",
    ),
    (
        "...quiero ver canales de televisión de otros países?",
        """En la vivienda solo hay televisión nacional española. En algunas viviendas hay Smart TV, lo que permite acceder a plataformas online si usted tiene cuenta propia. No hay canales internacionales instalados.""",
    ),
    (
        "...necesito comida, bebida o productos básicos?",
        """El apartamento se alquila tal y como aparece en las imágenes. El alojamiento incluye los enseres básicos de menaje, pero no incluye productos de alimentación, bebidas, especias ni detergentes. Puede adquirirlo en el supermercado más cercano.""",
    ),
    (
        "...necesito un taxi o traslado al aeropuerto?",
        """No disponemos de servicio de traslado. Puede utilizar las siguientes opciones:
• Taxi en Calpe: 📞 +34 965 83 78 78
• Servicio de shuttle Beniconnect: https://www.beniconnect.com/es/
• Autobuses de línea ALSA: https://www.alsa.es/""",
    ),
    (
        "...necesito enseres de playa (toallas, sillas o sombrillas)?",
        """El alojamiento no proporciona enseres de playa. Estos artículos no están incluidos en el equipamiento del apartamento.""",
    ),
    (
        "...necesito ropa de cama o toallas extra?",
        """La vivienda proporciona ropa de cama y toallas según la ocupación. Si necesita ropa extra, tiene un coste adicional. Debe consultar coste y disponibilidad directamente con la oficina de Inftour. Es necesario llevar a la oficina las sábanas o toallas usadas para realizar el cambio (con aviso previo).""",
    ),
    (
        "...los vecinos hacen ruido y no puedo dormir?",
        """Lamentamos la situación. Si el ruido persiste y no atienden a una comunicación respetuosa, debe llamar a la policía local.""",
    ),
]

DEST = [
    ("eng", "en"),
    ("ru", "ru"),
    ("fr", "fr"),
    ("it", "it"),
    ("de", "de"),
    ("uk", "uk"),
    ("pl", "pl"),
]


def protect_urls_emails(text: str) -> tuple[str, dict[str, str]]:
    placeholders: dict[str, str] = {}
    i = 0

    def sub(m: re.Match) -> str:
        nonlocal i
        key = f"__KEEP{i}__"
        placeholders[key] = m.group(0)
        i += 1
        return key

    # URLs
    text = re.sub(r"https?://[^\s]+", sub, text)
    # phone +34 ...
    text = re.sub(r"\+34\s*[\d\s/]+", sub, text)
    # emails
    text = re.sub(r"[\w.+-]+@inftour\.net", sub, text)
    return text, placeholders


def restore(text: str, placeholders: dict[str, str]) -> str:
    for k, v in placeholders.items():
        text = text.replace(k, v)
    return text


def translate_block(t: Translator, text: str, dest: str) -> str:
    prot, ph = protect_urls_emails(text)
    tr = t.translate(prot, src="es", dest=dest)
    time.sleep(0.25)
    return restore(tr.text, ph)


def main() -> None:
    assert len(PAIRS) == 20, len(PAIRS)
    translator = Translator()
    items: list[dict] = []

    for idx, (es_q, es_a) in enumerate(PAIRS, start=1):
        qmap = {"esp": es_q}
        amap = {"esp": es_a}
        print("Item", idx, "questions...")
        for key, gdest in DEST:
            qmap[key] = translate_block(translator, es_q, gdest)
            time.sleep(0.15)
        print("Item", idx, "answers...")
        for key, gdest in DEST:
            amap[key] = translate_block(translator, es_a, gdest)
            time.sleep(0.2)
        items.append({"n": idx, "q": qmap, "a": amap})
        print("Done", idx)

    OUT.write_text(json.dumps({"items": items}, ensure_ascii=False, indent=2), encoding="utf-8")
    print("Wrote", OUT)


if __name__ == "__main__":
    main()
