# Systemy / kodowanie cykliczne

## Spis treści

1. [Wstęp teoretyczny](#1-wstęp-teoretyczny)
2. [Przykłady systemów cyklicznych](#2-przykłady-systemów-cyklicznych)
3. [Zadanie CRC](#3-zadanie-crc)
4. [Rozwiązanie](#4-rozwiązanie)

---

## 1. Wstęp teoretyczny

**Kodowanie cykliczne** to rodzaj kodowania blokowego: poprawne słowa kodowe tworzy się według reguł opartych na wielomianach (zwykle w arytmetyce modulo 2).

Cecha charakterystyczna: każde poprawne słowo kodowe, po cyklicznym przesunięciu bitów, daje znowu poprawne słowo kodowe.

W praktyce najczęściej stosuje się **CRC** — do danych dopisuje się bity kontrolne (resztę z dzielenia przez wielomian generujący), dzięki czemu odbiorca może wykryć błędy transmisji.

---

## 2. Przykłady systemów cyklicznych

| System | Problem, który rozwiązuje |
|--------|---------------------------|
| **CRC** | Wykrywanie błędów w ramkach sieciowych, plikach, dyskach |
| **Kody BCH** | Korekcja wielu pojedynczych błędów bitowych |
| **Reed–Solomon** | Korekcja błędów grupowych (CD/DVD, QR, pamięci flash) |

---

## 3. Zadanie CRC

Wiadomość binarna: `1101`. Kodowanie CRC z wielomianem generującym `1011`.

1. Oblicz bity kontrolne.
2. Wyznacz słowo kodowe do wysłania.
3. Sprawdź, czy słowo kodowe jest poprawne.
4. Załóż, że podczas transmisji ostatni bit zmienił się z `1` na `0`. Ustal, czy odbiorca wykryje błąd.

---

## 4. Rozwiązanie

**Dane:** wiadomość `1101`, wielomian `1011` (4 bity → stopień 3 → 3 bity kontrolne).

Dopisujemy 3 zera: `1101` → `1101000`.

### Dzielenie modulo 2 (XOR)

```
1101000
1011000
-------
0110000
0101100
-------
0011100
0010110
-------
0001010
0001011
-------
0000001
```

Reszta (ostatnie 3 bity): **R = 001**

### Słowo kodowe

```
Dane:           1101
Bity kontrolne:  001
---------------
Słowo kodowe:   1101001
```

### Weryfikacja u odbiorcy

Dzielenie `1101001` przez `1011`:

```
1101001
1011000
-------
0110001
0101100
-------
0011101
0010110
-------
0001011
0001011
-------
0000000
```

Reszta = `000` → **brak błędu**.

### Punkt 4 — wykrycie błędu

Odebrane (zepsute) słowo: `1101000` (ostatni bit `1` → `0`).

```
1101000
1011000
-------
0110000
0101100
-------
0011100
0010110
-------
0001010
0001011
-------
0000001
```

Reszta ≠ `000` → **odbiorca wykryje błąd**.
