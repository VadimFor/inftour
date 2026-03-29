# -*- coding: utf-8 -*-
"""Emit app/lobby/translations/instr_whatif_merged.ts from structured items (8 langs each)."""
from __future__ import annotations

import json
from pathlib import Path
from textwrap import dedent

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "app" / "lobby" / "translations" / "instr_whatif_merged.ts"

# Each item: q and a per language code eng, esp, ru, fr, it, de, uk, pl
ITEMS: list[dict[str, dict[str, str]]] = []

LANG_ORDER = ("eng", "esp", "ru", "fr", "it", "de", "uk", "pl")


def esc(s: str) -> str:
    s = s.replace("\r\n", "\n").replace("\r", "\n")
    return (
        s.replace("\\", "\\\\")
        .replace("\n", "\\n")
        .replace("\t", "\\t")
        .replace('"', '\\"')
    )


def add_item(n: int, q: dict[str, str], a: dict[str, str]) -> None:
    ITEMS.append({"n": n, "q": q, "a": a})


# --- Item 1: vitrocerámica ---
add_item(
    1,
    q={
        "esp": "...la vitrocerámica o placa no funciona?",
        "eng": "...the ceramic hob or cooktop doesn't work?",
        "ru": "...стеклокерамическая варочная панель или плита не работает?",
        "fr": "...la plaque vitrocéramique ou la table de cuisson ne fonctionne pas ?",
        "it": "...il piano cottura in vetroceramica o i fuochi non funzionano?",
        "de": "...das Glaskeramik- oder Kochfeld funktioniert nicht?",
        "uk": "...склокерамічна варильна поверхня або плита не працює?",
        "pl": "...płyta ceramiczna lub kuchenka nie działa?",
    },
    a={
        "esp": dedent(
            """\
            Antes de contactar con Inftour, por favor siga estos pasos con calma:
            • PASO 1 – Comprobar si la vitrocerámica está bloqueada: En muchos casos la vitrocerámica no está averiada, sino bloqueada por seguridad. Mire atentamente el panel de control y compruebe si aparece un símbolo de candado, la letra "L" o una luz fija o parpadeante junto a estos símbolos. Para desbloquearla, mantenga el dedo pulsado de forma continua sobre el botón del candado o símbolo de bloqueo durante al menos 10 segundos, sin soltar. Espere a que el símbolo desaparezca o la vitro emita una señal y pruebe a encenderla de nuevo.
            • PASO 2 – Reiniciar la electricidad de la vivienda: Si tras varios intentos sigue sin funcionar, vaya al cuadro eléctrico, apague el interruptor general, espere 1 minuto completo y vuelva a encenderlo.
            • PASO 3 – Comprobar de nuevo la vitrocerámica: Después de restablecer la electricidad, la vitrocerámica puede haberse desbloqueado automáticamente o puede ser necesario repetir el PASO 1.
            • IMPORTANTE: No fuerce los botones, no manipule cables ni partes internas y no utilice objetos para pulsar el panel. Si sigue sin funcionar, contacte con Inftour indicando que ya ha realizado estas comprobaciones."""
        ).strip(),
        "eng": dedent(
            """\
            Before contacting Inftour, please follow these steps calmly:
            • STEP 1 – Check whether the ceramic hob is locked: In many cases the hob is not faulty but locked for safety. Look carefully at the control panel and check whether a padlock symbol, the letter "L", or a steady or flashing light appears next to these symbols. To unlock it, press and hold your finger continuously on the padlock or lock symbol button for at least 10 seconds without releasing. Wait until the symbol disappears or the hob signals, then try switching it on again.
            • STEP 2 – Reset the home’s electricity: If it still does not work after several attempts, go to the electrical panel, switch off the main breaker, wait a full minute, and switch it back on.
            • STEP 3 – Check the ceramic hob again: After restoring power, the hob may have unlocked automatically or you may need to repeat STEP 1.
            • IMPORTANT: Do not force the buttons, do not handle cables or internal parts, and do not use objects to press the panel. If it still does not work, contact Inftour stating that you have already carried out these checks."""
        ).strip(),
        "ru": dedent(
            """\
            Прежде чем связаться с Inftour, спокойно выполните следующие шаги:
            • ШАГ 1 – Проверьте, не заблокирована ли варочная панель: Зачастую панель не неисправна, а заблокирована для безопасности. Внимательно посмотрите на панель управления: нет ли символа замка, буквы «L» или постоянно горящего/мигающего индикатора рядом с ними. Чтобы разблокировать, непрерывно удерживайте палец на кнопке замка или символа блокировки не менее 10 секунд, не отпуская. Дождитесь, пока символ исчезнет или панель подаст сигнал, и снова попробуйте включить её.
            • ШАГ 2 – Сбросьте электропитание жилья: Если после нескольких попыток всё ещё не работает, подойдите к электрощиту, отключите главный автомат, подождите полную минуту и снова включите.
            • ШАГ 3 – Снова проверьте варочную панель: После восстановления питания панель могла разблокироваться автоматически или может потребоваться повторить ШАГ 1.
            • ВАЖНО: Не надавливайте на кнопки с усилием, не трогайте провода и внутренние части и не используйте предметы для нажатия на панель. Если не заработало, свяжитесь с Inftour, указав, что вы уже выполнили эти проверки."""
        ).strip(),
        "fr": dedent(
            """\
            Avant de contacter Inftour, veuillez suivre ces étapes calmement :
            • ÉTAPE 1 – Vérifier si la plaque vitrocéramique est verrouillée : Dans de nombreux cas, la plaque n’est pas en panne mais verrouillée pour des raisons de sécurité. Regardez attentivement le panneau de commande et vérifiez s’il y a un symbole de cadenas, la lettre « L » ou un voyant fixe ou clignotant à côté. Pour déverrouiller, maintenez le doigt enfoncé en continu sur le bouton du cadenas ou du symbole de verrouillage pendant au moins 10 secondes sans relâcher. Attendez que le symbole disparaisse ou que la plaque émette un signal, puis essayez de la rallumer.
            • ÉTAPE 2 – Réinitialiser l’électricité du logement : Si après plusieurs essais cela ne fonctionne toujours pas, allez au tableau électrique, coupez l’interrupteur général, attendez une minute complète, puis rallumez-le.
            • ÉTAPE 3 – Vérifier à nouveau la plaque : Après rétablissement du courant, la plaque peut s’être déverrouillée automatiquement ou il peut être nécessaire de répéter l’ÉTAPE 1.
            • IMPORTANT : N’exercez pas de force sur les boutons, ne manipulez pas les câbles ni les parties internes et n’utilisez pas d’objets pour appuyer sur le panneau. Si cela ne fonctionne toujours pas, contactez Inftour en indiquant que vous avez déjà effectué ces vérifications."""
        ).strip(),
        "it": dedent(
            """\
            Prima di contattare Inftour, segua questi passaggi con calma:
            • PASSO 1 – Verificare se il piano cottura in vetroceramica è bloccato: Spesso il piano non è guasto ma bloccato per sicurezza. Osservi attentamente il pannello comandi e controlli se compare un simbolo di lucchetto, la lettera "L" o una spia fissa o lampeggiante accanto a questi simboli. Per sbloccarlo, tenga premuto in modo continuo il dito sul pulsante del lucchetto o del simbolo di blocco per almeno 10 secondi senza rilasciare. Attenda che il simbolo scompaia o che il piano emetta un segnale, quindi provi ad accenderlo di nuovo.
            • PASSO 2 – Ripristinare l’elettricità dell’alloggio: Se dopo diversi tentativi non funziona ancora, vada al quadro elettrico, spenga l’interruttore generale, attenda 1 minuto intero e lo riaccenda.
            • PASSO 3 – Controllare di nuovo il piano cottura: Dopo il ripristino dell’elettricità, il piano può essersi sbloccato automaticamente oppure può essere necessario ripetere il PASSO 1.
            • IMPORTANTE: Non forzi i pulsanti, non maneggi cavi o parti interne e non usi oggetti per premere il pannello. Se continua a non funzionare, contatti Inftour indicando di aver già effettuato queste verifiche."""
        ).strip(),
        "de": dedent(
            """\
            Bevor Sie Inftour kontaktieren, gehen Sie bitte ruhig diese Schritte durch:
            • SCHRITT 1 – Prüfen, ob das Glaskeramikfeld gesperrt ist: Oft ist das Kochfeld nicht defekt, sondern aus Sicherheitsgründen gesperrt. Schauen Sie genau auf die Bedienfläche und prüfen Sie, ob ein Schlosssymbol, der Buchstabe „L“ oder eine dauerhaft leuchtende oder blinkende Anzeige daneben erscheint. Zum Entsperren halten Sie den Finger mindestens 10 Sekunden lang ununterbrochen auf der Taste mit Schloss- oder Sperrsymbol, ohne loszulassen. Warten Sie, bis das Symbol verschwindet oder das Feld ein Signal gibt, und schalten Sie es dann erneut ein.
            • SCHRITT 2 – Strom im Wohnobjekt zurücksetzen: Wenn es nach mehreren Versuchen weiterhin nicht funktioniert, gehen Sie zum Sicherungskasten, schalten Sie den Haupttrennschalter aus, warten Sie eine volle Minute und schalten Sie wieder ein.
            • SCHRITT 3 – Glaskeramikfeld erneut prüfen: Nach der Stromzurückstellung kann sich das Feld automatisch entsperrt haben oder SCHRITT 1 muss wiederholt werden.
            • WICHTIG: Drücken Sie die Tasten nicht mit Gewalt, berühren Sie keine Kabel oder Innenteile und benutzen Sie keine Gegenstände, um auf die Fläche zu drücken. Wenn es weiterhin nicht funktioniert, kontaktieren Sie Inftour und teilen Sie mit, dass Sie diese Prüfungen bereits durchgeführt haben."""
        ).strip(),
        "uk": dedent(
            """\
            Перш ніж звертатися до Inftour, будь ласка, спокійно виконайте такі кроки:
            • КРОК 1 – Перевірте, чи не заблокована склокерамічна плита: У багатьох випадках плита не зламалася, а заблокована з міркувань безпеки. Уважно подивіться на панель керування й перевірте, чи є символ замка, літера «L» або постійно горить/блимає індикатор поруч із цими символами. Щоб розблокувати, безперервно тримайте палець на кнопці замка чи символа блокування щонайменше 10 секунд, не відпускаючи. Дочекайтеся зникнення символу або сигналу від плити й знову спробуйте її увімкнути.
            • КРОК 2 – Перезапустіть електрику в житлі: Якщо після кількох спроб усе ще не працює, підійдіть до електрощита, вимкніть головний вимикач, зачекайте повну хвилину й увімкніть знову.
            • КРОК 3 – Знову перевірте плиту: Після відновлення живлення плита могла автоматично розблокуватися або може знадобитися повторити КРОК 1.
            • ВАЖЛИВО: Не натискайте кнопки з силою, не чіпайте кабелі та внутрішні частини й не використовуйте предмети для натискання на панель. Якщо не запрацювало, зв’яжіться з Inftour, вказавши, що ви вже зробили ці перевірки."""
        ).strip(),
        "pl": dedent(
            """\
            Zanim skontaktujesz się z Inftour, spokojnie wykonaj te kroki:
            • KROK 1 – Sprawdź, czy płyta ceramiczna jest zablokowana: W wielu przypadkach płyta nie jest uszkodzona, lecz zablokowana ze względów bezpieczeństwa. Uważnie przyjrzyj się panelowi sterowania i sprawdź, czy widoczny jest symbol kłódki, litera „L” lub świecąca albo migająca kontrolka obok tych symboli. Aby odblokować, przez co najmniej 10 sekund bez przerwy przytrzymaj palec na przycisku kłódki lub symbolu blokady, nie puszczając. Poczekaj, aż symbol zniknie lub płyta wyda sygnał, i spróbuj włączyć ją ponownie.
            • KROK 2 – Zresetuj zasilanie w mieszkaniu: Jeśli po kilku próbach nadal nie działa, przejdź do rozdzielnicy, wyłącz główny wyłącznik, odczekaj pełną minutę i włącz ponownie.
            • KROK 3 – Sprawdź płytę ponownie: Po przywróceniu zasilania płyta mogła się automatycznie odblokować lub konieczne może być powtórzenie KROKU 1.
            • WAŻNE: Nie używaj siły na przyciskach, nie manipuluj przewodami ani częściami wewnętrznymi i nie używaj przedmiotów do naciskania panelu. Jeśli nadal nie działa, skontaktuj się z Inftour, podając, że wykonałeś już te czynności sprawdzające."""
        ).strip(),
    },
)

# Continue with items 2-20 in the same script - file too long for single message.
# For maintainability, load remaining items from JSON next to this script.

DATA_PATH = Path(__file__).with_name("instr_whatif_data.json")


def main() -> None:
    global ITEMS
    if DATA_PATH.exists():
        raw = json.loads(DATA_PATH.read_text(encoding="utf-8"))
        ITEMS = raw["items"]
    lines = [
        'import type { InstrLangStrings } from "./instr_whatif_types";',
        "",
        "/** Full 'What to do if' guide from Lobby Instrucciones docx — all languages. */",
        "export const instrWhatIfTranslations: Record<string, InstrLangStrings> = {",
    ]
    for it in ITEMS:
        n = it["n"]
        for kind, key in (("q", f"lobInstr{n}Q"), ("a", f"lobInstr{n}A")):
            lines.append(f"  {key}: {{")
            for lg in LANG_ORDER:
                val = esc(it[kind][lg])
                lines.append(f'    {lg}: "{val}",')
            lines.append("  },")
    lines.append("};")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("Wrote", OUT, "items", len(ITEMS))


if __name__ == "__main__":
    # Seed JSON from ITEMS if not exists
    if not DATA_PATH.exists():
        DATA_PATH.write_text(
            json.dumps({"items": ITEMS}, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        print("Wrote seed", DATA_PATH, "— edit to add items 2-20, then re-run.")
    main()
