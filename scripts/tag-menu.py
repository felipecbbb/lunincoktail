#!/usr/bin/env python3
"""Reasigna en bloque las etiquetas de dieta/alergenos de toda la carta.

Uso: python3 scripts/tag-menu.py   (sobrescribe el campo `tags` de cada item)

OJO: pisa lo que se haya editado a mano desde /admin/menu. Para cambios
puntuales usa el admin; este script es para revisiones completas.

Asigna etiquetas de dieta/alergenos a cada item de la carta de Lunin.

Criterio (Reglamento UE 1169/2011 para alergenos):
  - Se declara el alergeno cuando un ingrediente de la receta lo contiene.
  - Los destilados alcoholicos estan exentos de declarar el cereal de origen,
    por eso el gin y las horilkas cuentan como sin gluten.
  - "vegan"/"vegetarian" son excluyentes: vegetarian solo cuando lleva huevo,
    lacteos o miel.
"""
import json
from pathlib import Path

MENU = Path(__file__).resolve().parent.parent / "src/data/menu.json"

V, VG, GF, AF = "vegan", "vegetarian", "gluten-free", "alcohol-free"
SPICY, CAF = "spicy", "caffeine"
EGG, MILK, FISH, GLU, SUL = "egg", "milk", "fish", "gluten", "sulphites"

TAGS = {
    # ── Botellas (destilados y licores propios) ───────────────────────────
    "itm-bot-gin": [V, GF],
    "itm-bot-apple-horilka": [V, GF],
    "itm-bot-plum-horilka": [V, GF],
    "itm-bot-acacia-horilka": [V, GF],          # flor de acacia, "nota" de miel
    "itm-bot-apple-brandy": [V, GF],
    "itm-bot-elderberry-brandy": [VG, GF],      # lleva miel -> no vegano
    "itm-bot-blackcurrant": [V, GF],
    "itm-bot-sourcherry": [V, GF],
    "itm-bot-blackberry": [V, GF],
    "itm-bot-strawberry": [V, GF],

    # ── Cocteles ──────────────────────────────────────────────────────────
    "itm-coc-apple-pie": [V, GF],
    "itm-coc-atardecer": [V, GF],
    "itm-coc-kiev": [VG, GF, EGG],              # clara de huevo
    "itm-coc-pornstar": [V, GF],
    "itm-coc-negroni": [V, GF],
    "itm-coc-daiquiri": [V, GF],                # caramelo = sirope
    "itm-coc-bloody-mary": [SPICY, FISH, GLU],  # Worcester: anchoa + cebada
    "itm-coc-cucumber-gimlet": [V, GF],
    "itm-coc-diabolito": [V, GF, SPICY],
    "itm-coc-espresso-martini": [V, GF, CAF],
    "itm-coc-kiwi-gimlet": [V, GF],
    "itm-coc-long-island": [V, GF, CAF],        # Coca-Cola
    "itm-coc-margarita": [V, GF],
    "itm-coc-matcha-sour": [VG, GF, EGG, CAF],
    "itm-coc-mule": [V],                        # ginger beer: puede llevar cebada
    "itm-coc-old-fashioned": [V, GF],
    "itm-coc-strawberry-margarita": [V, GF],
    "itm-coc-acacia-sour": [VG, GF, EGG],
    "itm-coc-apple-sour": [VG, GF, EGG],
    "itm-coc-plum-sour": [VG, GF, EGG],
    "itm-coc-gin-tonic": [V, GF],
    "itm-coc-brandy-cola": [V, GF, CAF],
    "itm-coc-agua-valencia": [V, GF],
    "itm-coc-mojito": [V, GF],
    "itm-coc-brandy": [V, GF],

    # ── Spritz (licor propio + espumoso -> sulfitos) ──────────────────────
    "itm-spr-sourcherry": [V, GF, SUL],
    "itm-spr-strawberry": [V, GF, SUL],
    "itm-spr-blackberry": [V, GF, SUL],
    "itm-spr-blackcurrant": [V, GF, SUL],
    "itm-spr-cranberry": [V, GF, SUL],

    # ── Vermut (vino: sulfitos; clarificado no garantizado vegano) ────────
    "itm-vermut": [GF, SUL],

    # ── Chupitos ──────────────────────────────────────────────────────────
    "itm-lqs-sourcherry": [V, GF],
    "itm-lqs-strawberry": [V, GF],
    "itm-lqs-blackberry": [V, GF],
    "itm-lqs-blackcurrant": [V, GF],
    "itm-lqs-cranberry": [V, GF],
    "itm-sht-apple": [V, GF],
    "itm-sht-plum": [V, GF],
    "itm-sht-acacia": [V, GF],
    "itm-sht-gin": [V, GF],
    "itm-sht-apple-brandy": [V, GF],
    "itm-sht-elderberry": [VG, GF],             # miel

    # ── Cafe ──────────────────────────────────────────────────────────────
    "itm-caf-solo": [V, GF, AF, CAF],
    "itm-caf-leche": [VG, GF, AF, CAF, MILK],
    "itm-caf-cortado": [VG, GF, AF, CAF, MILK],
    "itm-caf-capuchino": [VG, GF, AF, CAF, MILK],
    "itm-caf-bombon": [VG, GF, AF, CAF, MILK],  # leche condensada
    "itm-caf-doble": [V, GF, AF, CAF],

    # ── Agua ──────────────────────────────────────────────────────────────
    "itm-agua-gas": [V, GF, AF],
    "itm-agua-sin-gas": [V, GF, AF],

    # ── Refrescos ─────────────────────────────────────────────────────────
    "itm-ref-coca": [V, GF, AF, CAF],
    "itm-ref-fanta": [V, GF, AF],
    "itm-ref-fanta-naranja": [V, GF, AF],

    # ── Mocktails ─────────────────────────────────────────────────────────
    "itm-moc-espresso-orange": [V, GF, AF, CAF],
    "itm-moc-mojito": [V, GF, AF],
    "itm-moc-diabolito": [V, GF, AF, SPICY],
    "itm-moc-passion-spritz": [V, GF, AF],
    "itm-moc-cucumber": [V, GF, AF],
    "itm-moc-kiwi-gimlet": [V, GF, AF],
}

PRIORITY = [EGG, MILK, GLU, FISH, SUL, SPICY, AF, V, VG, CAF, GF]


def main():
    data = json.loads(MENU.read_text(encoding="utf-8"))
    items = data["items"]
    ids = {i["id"] for i in items}

    missing = ids - TAGS.keys()
    extra = TAGS.keys() - ids
    if missing:
        raise SystemExit(f"Items sin etiquetar: {sorted(missing)}")
    if extra:
        raise SystemExit(f"Ids inexistentes en el mapa: {sorted(extra)}")

    for it in items:
        tags = TAGS[it["id"]]
        assert not (V in tags and VG in tags), it["id"]
        it["tags"] = sorted(set(tags), key=PRIORITY.index)

    MENU.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    from collections import Counter
    c = Counter(t for i in items for t in i["tags"])
    print(f"{len(items)} items etiquetados")
    for t in PRIORITY:
        print(f"  {t:14s} {c[t]}")


if __name__ == "__main__":
    main()
