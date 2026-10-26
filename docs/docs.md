# 1. Czym jest kodowanie cykliczne?

Kodowanie cykliczne to rodzaj kodowania blokowego, w którym każde przesunięcie cykliczne poprawnego słowa kodowego również jest poprawnym słowem kodowym. Wykorzystuje się je do wykrywania, a w niektórych przypadkach również do korygowania błędów powstałych podczas przesyłania lub przechowywania danych.

# 2. Do czego wykorzystuje się kodowanie cykliczne?

Główne zastosowania to:

- Wykrywanie błędów transmisji — sprawdzanie, czy dane przesłane przez sieć zostały uszkodzone.
- Kontrola poprawności danych — wykrywanie błędów podczas zapisu lub odczytu informacji.
- Telekomunikacja i sieci komputerowe — sprawdzanie poprawności przesyłanych ramek danych, np. za pomocą CRC (cyklicznej kontroli nadmiarowej).
- Pamięci i nośniki danych — wykrywanie błędów w zapisanych informacjach.
- Systemy transmisji cyfrowej — zwiększanie niezawodności przesyłania informacji.

# 3. Jak działa kodowanie cykliczne w praktyce?

1. Nadawca posiada dane, które chce przesłać.
2. Na podstawie określonych reguł kodowania oblicza dodatkowe bity kontrolne.
3. Dane wraz z bitami kontrolnymi są przesyłane do odbiorcy.
4. Odbiorca wykonuje odpowiednie obliczenia kontrolne.
5. Jeżeli wynik wskazuje niezgodność, odbiorca wykrywa błąd w przesłanych danych.

**Ważne:** samo wykrycie błędu nie oznacza automatycznie możliwości jego naprawienia. Zależy to od zastosowanego kodu i jego właściwości.

# 4. Pomysł na projekt — symulator sieci z CRC

Projekt typu Packet Tracer dobrze pasuje do założeń: na siatce buduje się sieć (np. 5 komputerów → switch → serwer plików), komputery wysyłają i pobierają pliki, a transmisja jest wizualizowana i weryfikowana przez CRC.

**Warunek:** CRC musi realnie uczestniczyć w działaniu systemu (podział na bloki, kontrola, ewentualna retransmisja), a nie tylko wyświetlać wynik obliczeń.

Główne elementy:
- edytor topologii (urządzenia, połączenia, zapis/odczyt układu),
- serwer plików (rzeczywisty zapis, lista, pobieranie),
- symulator transmisji (bloki + CRC, opcjonalne uszkodzenie danych, retransmisja),
- panel diagnostyczny (status bloków, log zdarzeń).

Najmocniejszy element prezentacji: tryb symulacji błędów — celowe uszkodzenie bloku, wykrycie przez CRC, odrzucenie i ponowne przesłanie.
