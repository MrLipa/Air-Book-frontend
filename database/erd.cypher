MATCH(a) DETACH DELETE a;

WITH [
        [1, 'USA', 'Atlanta', 'https://www.gdzie-i-kiedy.pl/site/images/illustration/atlanta-georgie_809.jpg'],
        [2, 'USA', 'Chicago', 'https://cdn.hometogo.net/assets/media/pics/1920_600/611b92129d477.jpg'],
        [3, 'USA', 'Dallas', 'https://cdn.britannica.com/31/94331-050-4B1F71C2/Skyline-Dallas-Texas.jpg'],
        [4, 'Mexico', 'Mexico City', 'https://cdn.britannica.com/08/95008-050-1BA29F61/Central-Mexico-City.jpg'],
        [5, 'Columbia', 'Bogota', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Centro_internacional.JPG/1200px-Centro_internacional.JPG'],
        [6, 'Brazil', 'Rio de Janeiro', 'https://europa-swiat.um.warszawa.pl/documents/14548645/15990123/rio.jpg/ddeb87f1-d443-b6a9-7ae4-8ab16a43b142?version=1.0&t=1614690007093'],
        [7, 'Spain', 'Madrid', 'https://cdn.kimkim.com/files/a/content_articles/featured_photos/1df1b4ea9e983381a1e9ed40ebb2ecde420eee23/big-63eb26f0b9d0e93d444828f841f89bb2.jpg'],
        [8, 'England', 'London', 'https://pliki.portalsamorzadowy.pl/i/18/93/40/189340_r0_940.jpg'],
        [9, 'Netherlands', 'Rotterdam', 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/e7/69/5e/rotterdam.jpg?w=700&h=500&s=1'],
        [10, 'Italy', 'Rome', 'https://lp-cms-production.imgix.net/2021-03/500pxRF_77415821.jpg?auto=format&w=1440&h=810&fit=crop&q=75'],
        [11, 'France', 'Paris', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbR1d_qOqkRZt2136CpFgnmTSPER5s0xQbxP-cGlmXX26L4bMk7-d7yOTQRGjFLhaui7g&usqp=CAU'],
        [12, 'Germany', 'Berlin', 'https://www.deutschland.de/sites/default/files/media/image/T%C3%BCD_Politisches_Zentrum-Berlin_Reichstagsgeb%C3%A4ude.jpg'],
        [13, 'Poland', 'Warsaw', 'https://go2warsaw.pl/wp-content/uploads/Stare-Miasto-fot.-Cezary-Wars-m.st_.-Warszawa-1.jpg'],
        [14, 'Greece', 'Athens', 'https://www.thetimes.co.uk/imageserver/image/%2Fmethode%2Fsundaytimes%2Fprod%2Fweb%2Fbin%2Fb773a9be-bbdb-11ec-84c4-70cc6ae427fb.jpg?crop=4754%2C3170%2C119%2C79'],
        [15, 'China', 'Beijing', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqerNIPBP0x4n9Icl7iKhHXGhzBmHrt2ZJhGHiHVjn8S19Mw2-X-XJc7vTywcx7NZz2MA&usqp=CAU'],
        [16, 'China', 'Hong Kong', 'https://static.toiimg.com/thumb/msid-68466496,width-748,height-499,resizemode=4,imgsize-2496539/.jpg'],
        [17, 'China', 'Shanghai', 'https://www.planete-energies.com/sites/default/files/styles/1200x630/public/migrated_files/images/thumbnails/image/thinkstockphotos-589429616_1_0.jpg?itok=GI2zvMLw'],
        [18, 'South Korea', 'Seoul', 'https://content.r9cdn.net/rimg/dimg/30/0c/6318617a-city-35982-163ff913019.jpg?width=1366&height=768&xhint=2421&yhint=1876&crop=true'],
        [19, 'Japan', 'Tokyo', 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg'],
        [20, 'Singapore', 'Singapore', 'https://i.natgeofe.com/k/95d61645-a0c7-470f-b198-74a399dd5dfb/singapore-city_2x3.jpg']
    ] AS nested
    UNWIND nested AS row
    MERGE (a:Airport {airport_id: row[0], country: row[1], city: row[2], image: row[3]})


WITH [
        [1, 'Atlanta', 'Dallas', 800, '2025-07-08', 150, '5h 40m', 'Delta Airlines', 'Economy', 120],
        [2, 'Chicago', 'Dallas', 1000, '2025-07-19', 160, '3h 20m', 'American Airlines', 'Business', 80],
        [3, 'Dallas', 'Mexico City', 1300, '2025-08-03', 220, '6h 15m', 'Southwest Airlines', 'Economy', 200],
        [4, 'Mexico City', 'Bogota', 1500, '2025-09-12', 230, '4h 50m', 'Avianca', 'Business', 100],
        [5, 'Bogota', 'Rio de Janeiro', 1800, '2025-10-24', 240, '7h 30m', 'LATAM Airlines', 'Economy', 150],
        [6, 'Rio de Janeiro', 'Chicago', 2000, '2025-11-15', 500, '8h 15m', 'United Airlines', 'Business', 250],
        [7, 'Madrid', 'Paris', 1100, '2025-08-20', 110, '2h 40m', 'Iberia', 'Economy', 90],
        [8, 'London', 'Paris', 900, '2025-09-11', 120, '3h 55m', 'British Airways', 'Business', 70],
        [9, 'Rotterdam', 'London', 400, '2025-12-02', 130, '1h 10m', 'KLM Royal Dutch Airlines', 'Economy', 110],
        [10, 'Rome', 'Rotterdam', 1100, '2025-12-29', 210, '6h 45m', 'Alitalia', 'Business', 120],
        [11, 'London', 'Berlin', 900, '2025-08-06', 220, '2h 20m', 'Lufthansa', 'Economy', 80],

        [12, 'Warsaw', 'Berlin', 1000, '2025-01-15', 230, '4h 30m', 'LOT Polish Airlines', 'Business', 150],
        [13, 'Warsaw', 'Athens', 1500, '2025-02-18', 240, '5h 55m', 'Aegean Airlines', 'Economy', 100],
        [14, 'Beijing', 'Hong Kong', 2000, '2025-03-11', 250, '9h 20m', 'Air China', 'Business', 180],
        [15, 'Beijing', 'Shanghai', 1200, '2025-03-28', 260, '3h 45m', 'China Eastern Airlines', 'Economy', 200],
        [16, 'Shanghai', 'Seoul', 800, '2025-04-09', 270, '2h 55m', 'Korean Air', 'Business', 120],
        [17, 'Seoul', 'Tokyo', 900, '2025-04-26', 280, '4h 10m', 'Asiana Airlines', 'Economy', 150],
        [18, 'Tokyo', 'Singapore', 1500, '2025-05-07', 290, '7h 25m', 'Singapore Airlines', 'Business', 200],
        [19, 'Beijing', 'Singapore', 3000, '2025-05-17', 300, '10h 35m', 'Cathay Pacific', 'Economy', 250],
        [20, 'Chicago', 'Shanghai', 9000, '2025-06-02', 1000, '13h 45m', 'United Airlines', 'Business', 300],
        [21, 'Atlanta', 'Warsaw', 7500, '2025-06-12', 600, '12h 55m', 'LOT Polish Airlines', 'Economy', 180],
        [22, 'Tokyo', 'Paris', 11000, '2025-06-29', 1200, '14h 20m', 'Air France', 'Business', 350]
    ] AS nested
    UNWIND nested AS row
    MERGE (a:Airport {city: row[1]})
    MERGE (b:Airport {city: row[2]})
    MERGE (a)-[r_in:Flight {flight_id: row[0], distance: row[3], date: row[4], price: row[5], duration: row[6], airlines: row[7], class: row[8], free_seats: row[9]}]->(b)
