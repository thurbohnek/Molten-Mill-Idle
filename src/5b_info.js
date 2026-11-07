
/* ---------- tap-to-explain: a short tap on anything in the plant opens an explanation bubble ----------
   texts are [Norwegian, English]; titles reuse the game's names where they exist. */
const IX={
 up:{
  carry:['Du bærer flere ting om gangen, så hver tur flytter mer.','You carry more items at a time, so every trip moves more.'],
  speed:['Du går raskere mellom stasjonene.','You walk faster between the stations.'],
  yard:['Flere skrapleveranser til skraphaugen: den fylles raskere og rommer mer.','More scrap deliveries to the scrap pile: it refills faster and holds more.'],
  kran:['En traverskran med løftemagnet flytter skrap fra haugen til chargeringen av seg selv. Hvert nivå løfter mer og kjører raskere.','An overhead crane with a lifting magnet moves scrap from the pile to the charging area by itself. Each level lifts more and moves faster.'],
  charge:['Mer plass til skrap ved ovnen: større skrapkasse (konverter), flere chargeringskasser (SM-ovn), større skrapkurv (lysbueovn) eller raskere chargeringsbånd.','More room for scrap at the furnace: a bigger scrap box (converter), more charging boxes (open hearth), a bigger scrap bucket (arc furnace) or a faster charging conveyor.'],
  magnet:['Større løftemagnet på chargeringskranen (båndchargering): hvert nivå løfter mer skrap per tur.','A bigger lifting magnet on the charging crane (conveyor charging): each level lifts more scrap per trip.'],
  yard2:['En skraphaug til, med egne leveranser – dobbelt så mye skrap å hente fra.','A second scrap pile with its own deliveries – twice as much scrap to pick from.'],
  forvarm:['Skrapkurven forvarmes med varm avgass før chargering. Varmt skrap smelter med mindre strøm.','The scrap bucket is preheated with hot off-gas before charging. Warm scrap melts with less electricity.'],
  furnace:['Større ovn eller konverter: mer stål per charge. Den trenger også mer skrap, råjern og forsyning.','A bigger furnace or converter: more steel per heat. It also needs more scrap, hot metal and supplies.'],
  power:['Raskere smelting eller blåsing: sterkere blåsemaskin (Bessemer), sterkere brennere (SM-ovn), kraftigere O₂-lanse (LD) eller mer transformatoreffekt (lysbueovn).','Faster melting or blowing: a stronger blowing engine (Bessemer), stronger burners (open hearth), a stronger O₂ lance (LD) or more transformer power (arc furnace).'],
  refine:['Kortere tid fra smeltet bad til stål som er klart til tapping: prøvetaking, temperatur og analyse går raskere.','Less time from a melted bath to steel that is ready to tap: sampling, temperature and analysis go faster.'],
  tapauto:['Automatisk tapping: tappehullet fylles med sand av en robot, tippingen styres automatisk og øsevogna står klar. Hvert nivå gjør selve tappingen (og konverterens tipping ved chargering) kortere, så ovnen står mindre uten strøm.','Automated tapping: a robot fills the tap hole with sand, the tilting is controlled automatically and the ladle car stands ready. Each level makes the tap itself (and the converter’s charging tilt) shorter, so the furnace spends less time with the power off.'],
  operator:['En tapper ved pulten ved TAPP. Han tapper hver charge for deg, så du slipper å gå dit.','A furnace tapper at the desk next to TAP. He taps every heat for you, so you don’t have to walk there.'],
  ladle:['En øse til i omløp. Mens én øse støpes, behandles eller står i blokkstøpingen, kan neste stå klar på øsevogna under tappen.','One more ladle in circulation. While one ladle is casting, being treated or standing at the ingot pit, the next can wait on the ladle car under the tap.'],
  slagcap:['Slaggpotta rommer mer før den må tømmes. Full potte stopper ovnen. En større potte gir også litt mer betalt for slagget.','The slag pot holds more before it must be emptied. A full pot stops the furnace. A bigger pot also earns a little more for the slag.'],
  slaggbil:['En slaggbil henter den fulle slaggpotta og tømmer den på slaggplassen av seg selv. Slagget selges som pukk.','A slag pot carrier picks up the full pot and empties it at the slag yard by itself. The slag is sold as aggregate.'],
  kalk:['Brent kalk og dolomitt danner slagget som tar opp fosfor og svovel og beskytter ovnsforingen. Ovnen kan ikke smelte raskere enn kalkanlegget leverer.','Burnt lime and dolomite form the slag that takes up phosphorus and sulphur and protects the furnace lining. The furnace can’t melt faster than the lime plant delivers.'],
  o2:['Et luftseparasjonsanlegg lager rent oksygen. LD-konverteren blåser det inn i råjernet; lysbueovnen bruker det til å skjære skrap og brenne av karbon.','An air separation plant makes pure oxygen. The LD converter blows it into the hot metal; the arc furnace uses it to cut scrap and burn off carbon.'],
  lans:['Dørlansemanipulatoren, og senere veggmonterte injektorer, blåser oksygenet mer effektivt inn i badet: mer O₂-kapasitet.','A door lance manipulator, and later wall-mounted injectors, blow the oxygen into the bath more efficiently: more O₂ capacity.'],
  elekkran:['Lysbueovnen bruker opp grafittelektrodene. Elektrodekranen skjøter på nye fra lageret av seg selv.','The arc furnace burns up its graphite electrodes. The electrode crane adds new ones from the store by itself.'],
  kull:['Kullpulver blåses inn i slagget. Gassen lager skumslagg som skjermer lysbuen, så mer av energien går til stålet.','Powdered coal is injected into the slag. The gas makes a foaming slag that shields the arc, so more of the energy goes into the steel.'],
  rjsize:['Større masovn gir mer råjern per minutt – med el-råjernsovnen gir hvert nivå mer transformatoreffekt (MVA).','A bigger blast furnace makes more hot metal per minute – with the electric smelter each level adds transformer power (MVA).'],
  malmtog:['Flere malmtog til malmlageret: det fylles raskere og rommer mer.','More ore trains to the ore yard: it refills faster and holds more.'],
  malmkran:['En gripekran flytter malm fra malmlageret til skipet av seg selv. Hvert nivå gir større grabb og raskere kran.','A grab crane moves ore from the ore yard to the skip by itself. Each level gives a bigger grab and a faster crane.'],
  skip:['Skipet er vogna som drar malmen opp skråbanen til toppen av masovnen. Større skip (eller chargeringsbånd) rommer mer malm.','The skip is the car that hauls ore up the incline to the top of the blast furnace. A bigger skip (or charging belt) holds more ore.'],
  torp:['Torpedovogner frakter flytende råjern fra masovnen til stålverket. En større vogn tar mer per tur og kjører litt raskere.','Torpedo cars carry liquid hot metal from the blast furnace to the melt shop. A bigger car takes more per trip and runs a little faster.'],
  torpn:['En torpedovogn til, så én kan fylles mens en annen tømmes i stålverket.','One more torpedo car, so one can fill while another empties at the melt shop.'],
  koks:['Koksverket baker kull til koks. Koksen er både brensel og reduksjonsmiddel i masovnen.','The coke plant bakes coal into coke. Coke is both the fuel and the reducing agent in the blast furnace.'],
  cowper:['Cowpere (varmeapparater) varmer blåseluften til over 1000 °C før den blåses inn i masovnen. Varmere blåst gir mer råjern.','Hot stoves (cowpers) heat the blast air to over 1000 °C before it is blown into the blast furnace. Hotter blast gives more iron.'],
  sinter:['Sinterverk, og senere pelletverk, gjør finmalt malm om til porøse klumper. Masovnen går jevnere og får mer jern ut av hvert tonn malm.','A sinter plant, and later a pellet plant, turns fine ore into porous lumps. The furnace runs smoother and gets more iron out of every tonne of ore.'],
  lfq:['Bedre legering og temperaturstyring i øseovnen: høyere kvalitet og høyere pris på alt stål som går gjennom den.','Better alloying and temperature control in the ladle furnace: higher quality and a higher price for all steel that goes through it.'],
  lft:['Kortere behandlingstid i øseovnen, og øsevogna kjører litt raskere.','Shorter treatment time in the ladle furnace, and the ladle car runs a little faster.'],
  osekran:['En raskere øsekran (som også heiser raskere) løfter øsene fra øseovnen til støpingen og bringer de tomme tilbake.','A faster ladle crane (that also hoists faster) lifts the ladles from the ladle furnace to casting and brings the empty ones back.'],
  kokup:['Flere kokiller (støpeformer) på bunnplata, så en hel øse kan støpes på én gang.','More moulds on the bottom plate, so a full ladle can be cast in one go.'],
  kokbig:['Større kokiller: hver støpeblokk blir tyngre.','Bigger moulds: every ingot is heavier.'],
  solid:['Blokkene størkner raskere i kokillene, så bunnplata blir ledig tidligere.','The ingots solidify faster in the moulds, so the bottom plate is free sooner.'],
  kran2:['Kokillekranen flytter tomme og varme kokiller raskere av seg selv.','The mould crane moves empty and hot moulds faster by itself.'],
  kanal:['Ved stigstøping renner stålet gjennom kanaler av ildfast stein under bunnplata og opp i kokillene. Med ferdige kanalsteiner går oppsettet mye raskere.','In bottom pouring the steel runs through channels of refractory brick under the plate and up into the moulds. Ready-made runner bricks make the set-up much faster.'],
  hette:['Isolerende, varmeavgivende pulver som strøs på toppen av hver blokk rett etter støping. Toppen holdes flytende lenger, så krympehulrommet (lunkeren) havner i toppen som kappes – mer godt stål per blokk.','Insulating, heat-giving powder spread on top of each ingot right after pouring. It keeps the top liquid longer so the shrinkage cavity (pipe) ends up in the top that is cut off – more good steel per ingot.'],
  strands:['Flere strenger på stranggjuteanlegget: mer stål støpes samtidig.','More strands on the continuous caster: more steel is cast at the same time.'],
  caster:['Høyere støpefart: strengene trekkes raskere ut av kokillene.','Higher casting speed: the strands are withdrawn faster from the moulds.'],
  torch:['Skjærebrenner i stedet for saks: renere kutt og litt mindre tap.','A cutting torch instead of a shear: cleaner cuts and a little less loss.'],
  turret:['Et øsetårn holder to øser. Mens den ene støper, svinges den neste inn – sekvensstøping uten stopp.','A ladle turret holds two ladles. While one casts, the next is swung in – sequence casting without stopping.'],
  truck:['Bedre salgsavtale: høyere grunnpris for alt du selger, også til tog og skip.','A better sales contract: a higher base price for everything you sell, train and ship included.'],
  hspeed:['Alle hjelpere går raskere.','All helpers walk faster.'],
  hcap:['Alle hjelpere bærer mer per tur.','All helpers carry more per trip.'],
  gjvup:['Gjennomvarmingsovnen varmer emnene til valsetemperatur (ca. 1150–1200 °C). Mer kapasitet = flere emner i timen.','The reheating furnace heats billets to rolling temperature (about 1150–1200 °C). More capacity = more billets per hour.'],
  bjelke:['En bjelkeovn (walking beam) løfter emnene trinnvis gjennom ovnen og varmer dem jevnt fra alle sider.','A walking-beam furnace lifts the billets step by step through the furnace and heats them evenly from all sides.'],
  magkran:['En magnetkran flytter emner fra kjølesenga til gjennomvarmingsovnen av seg selv.','A magnet crane moves billets from the cooling bed to the reheating furnace by itself.'],
  varm:['Varminnsetting: emnene går varme rett fra stranggjutingen på rullebane inn i ovnen. Sparer energi og tid, og ingen må bære dem.','Hot charging: billets go straight from the caster on a roller table into the furnace while still hot. Saves energy and time, and nobody has to carry them.'],
  vvup:['Raskere valsing: valseverket gjør flere emner om til armeringsstål.','Faster rolling: the mill turns more billets into rebar.'],
  splitt:['Splittvalsing deler stangen i to eller flere strenger i valseverket, så flere tynne stenger kommer ut samtidig.','Slit rolling splits the bar into two or more strands in the mill, so several thin bars come out at once.'],
  rullkob:['Rullebane fra valseverket til klipp og bøy, så armeringen går dit av seg selv.','A roller table from the rolling mill to cut & bend, so the rebar goes there by itself.'],
  tcup:['Bråkjølingen kjøler overflaten av stangen med vann rett etter siste valsepar. Mer kapasitet = flere stenger.','The quench line quenches the surface of the bar with water right after the last stand. More capacity = more bars.'],
  stelup:['Raskere ferdigblokk i valstrådlinja.','A faster finishing block on the wire-rod line.'],
  stelmor:['Kjølevifter kjøler valstrådringene kontrollert på transportøren, så strukturen blir riktig.','Cooling fans cool the wire-rod rings in a controlled way on the conveyor, so the steel gets the right structure.'],
  ktrans:['Kveiletransport fra valstrådlinja til nettverket, så kveilene går dit av seg selv.','A coil conveyor from the wire-rod line to mesh welding, so the coils go there by themselves.'],
  nettup:['Raskere sveisemaskin: mer valstråd blir til armeringsnett.','A faster welding machine: more wire rod becomes rebar mesh.'],
  kobup:['Raskere bøyemaskiner i klipp og bøy.','Faster bending machines at cut & bend.'],
  togp:['Bedre togavtale: toget betaler mer per tonn.','A better rail contract: the train pays more per tonne.'],
  kaip:['Bedre kaiavtale: skipet betaler mer per tonn.','A better shipping contract: the ship pays more per tonne.']},
 /* operators (arc-furnace eras): helpers who run the plant from desks and crane cabs */
 op:{
  skrap:['Kranførere kjører skrapkranen fra kranpulten og førerhuset. Hver kranfører gir kranen større løft og litt mer fart.','Crane operators run the scrap crane from the pulpit and the cab. Each operator gives the crane a bigger lift and a little more speed.'],
  ovn:['Kontrollromsoperatører kjører ovnen fra kontrollrommet: slaggbilen kjører tidligere og raskere, så slaggpotta aldri stopper ovnen.','Control-room operators run the furnace from the control room: the slag pot carrier goes earlier and faster, so the slag pot never stops the furnace.'],
  blokk:['Blokkoperatører kjører kokillekranen fra pulten (raskere for hver operatør) og sender ut én transportvogn til med støpeblokker.','Teeming operators run the mould crane from the desk (faster for each operator) and dispatch one more transport car with ingots.'],
  strang:['Strengoperatører sitter ved strengpulten i kontrollrommet og i magnetkranen. Hver operatør sender ut én transportvogn til med emner.','Caster operators sit at the caster desk in the control room and in the magnet crane. Each operator dispatches one more transport car with billets.'],
  vv:['Valseoperatører styrer valseverket fra pulten. Hver operatør sender ut én transportvogn til med armeringsstål.','Mill operators run the rolling mill from the desk. Each operator dispatches one more transport car with rebar.'],
  tc:['Bråkjølingsoperatører styrer linja fra pulten og sender ut én transportvogn til hver.','Quench operators run the line from the desk; each dispatches one more transport car.'],
  stel:['Valstrådoperatører styrer linja fra pulten og sender ut én transportvogn til hver.','Wire-rod operators run the line from the desk; each dispatches one more transport car.'],
  nett:['Sveiseoperatører styrer nettverket fra pulten og sender ut én transportvogn til hver.','Welding operators run the mesh line from the desk; each dispatches one more transport car.'],
  kob:['Bøyeoperatører styrer klipp og bøy fra pulten og sender ut én transportvogn til hver.','Bending operators run cut & bend from the desk; each dispatches one more transport car.']},
 hire:{
  rj:['Malmhjelpere bærer malm fra malmlageret til skipet, og masseljern til salg.','Ore helpers carry ore from the ore yard to the skip, and pig iron to sale.'],
  skrap:['Skraphjelpere bærer skrap fra haugen til chargeringen.','Scrap helpers carry scrap from the pile to the charging area.'],
  ovn:['Ovnshjelpere tømmer slaggpotta og fyller elektrodestativet.','Furnace helpers empty the slag pot and refill the electrode rack.'],
  blokk:['Blokkhjelpere setter kokiller på bunnplata, bærer kanalstein, varmholdsmasse og varme kokiller, og selger støpeblokkene.','Ingot helpers set moulds on the bottom plate, carry runner bricks, hot-top compound and hot moulds, and sell the ingots.'],
  strang:['Emnehjelpere bærer emner fra kjølesenga til gjennomvarmingen eller til salg.','Billet helpers carry billets from the cooling bed to reheating or to sale.'],
  vv:['Valseverkshjelpere bærer armeringsstål til klipp og bøy eller til salg.','Rolling-mill helpers carry rebar to cut & bend or to sale.'],
  tc:['Bråkjølingshjelpere bærer Bråkjølt armering videre eller til salg.','Quench helpers carry Quenched rebar onward or to sale.'],
  stel:['Valstrådhjelpere bærer kveiler til nettverket eller til salg.','Wire-rod helpers carry coils to mesh welding or to sale.'],
  nett:['Netthjelpere bærer armeringsnettene til salg.','Mesh helpers take the rebar mesh to sale.'],
  kob:['Bøyehjelpere bærer den bøyde armeringen til salg.','Bending helpers take the bent rebar to sale.'],
  all:['Når en kran eller rullebane gjør jobben, venter de ved operatørpulten.','When a crane or conveyor covers the job, they wait at the operator desk.']},
 zone:{
  cr:['Kontrollrommet: ovnen, øsekranen og strengen kjøres herfra. Ta over en pult ved å trykke på den.','The control room: the furnace, the ladle crane and the caster are run from here. Take over a desk by tapping it.'],
  rjsup:['Forsyning til råjernsovnen: koksverk og cowpere (transformatorer for el-ovnen). Ovnen går ikke raskere enn forsyningen.','Supplies for the iron furnace: coke plant and hot stoves (transformers for the electric smelter). The furnace can’t run faster than its supplies.'],
  rj:['Råjernsverket: malm og koks smeltes til flytende råjern, som går med torpedovogn til stålverket. Overskudd støpes til masseljern.','The ironworks: ore and coke are smelted into liquid hot metal, which goes by torpedo car to the melt shop. Any surplus is cast into pig iron.'],
  skrap:['Skrapplassen: skrap hentes fra haugene og legges i chargeringen ved ovnen.','The scrap yard: scrap is taken from the piles to the charging area next to the furnace.'],
  sup:['Forsyningsanlegg for stålovnen: kalk og dolomitt, oksygen og kull. Ovnen smelter aldri raskere enn det svakeste anlegget leverer.','Supply plants for the steel furnace: lime and dolomite, oxygen and coal. The furnace never melts faster than the weakest plant delivers.'],
  ovn:['Stålverket: her blir råjern og skrap til flytende stål på rundt 1600 °C. Ovnstypen skifter gjennom spillet.','The melt shop: hot metal and scrap become liquid steel at about 1600 °C. The furnace type changes through the game.'],
  lf:['Øseovnen varmer stålet i øsa med elektroder og justerer legeringen. Bedre kvalitet gir høyere pris.','The ladle furnace reheats the steel in the ladle with electrodes and trims the alloys. Better quality gives a higher price.'],
  blokk:['Blokkstøping: stålet stigstøpes nedenfra og opp i kokiller på en bunnplate. Når blokkene har størknet, strippes kokillene av.','Ingot casting: the steel is bottom-poured up into moulds standing on a plate. When the ingots are solid, the moulds are stripped off.'],
  strang:['Stranggjuting: stålet renner fra øsa via fordelerrenna ned i vannkjølte kobberkokiller og trekkes ut som en sammenhengende streng som kappes til emner.','Continuous casting: the steel runs from the ladle through the tundish into water-cooled copper moulds and is drawn out as an endless strand that is cut into billets.'],
  salg1:['Salg: lastebilen kjøper alt du leverer. Penger fra hjelperne legges i en bunke ved bilen.','Sales: the truck buys everything you bring. Money from helpers is stacked next to it.'],
  gjv:['Gjennomvarming: kalde emner varmes til rundt 1200 °C så de kan valses.','Reheating: cold billets are heated to about 1200 °C so they can be rolled.'],
  vv:['Valseverket: det glødende emnet går gjennom mange valsepar og blir til tynne armeringsstenger.','The rolling mill: the glowing billet passes through many roll stands and becomes thin reinforcing bars.'],
  tc:['Bråkjøling: vannkjøling gir hard overflate og seig kjerne – sterk B500-armering uten dyre legeringer.','Quench line: water quenching gives a hard skin and a tough core – strong B500 rebar without costly alloys.'],
  stel:['Valstrådlinja: ferdigblokk, leggehode og kjøletransportør lager kveiler av tynn tråd.','The wire-rod line: finishing block, laying head and cooling conveyor make coils of thin rod.'],
  nett:['Nettverket sveiser valstråd til armeringsnett for betong.','Mesh welding turns wire rod into welded reinforcing mesh for concrete.'],
  salg2:['Salg 2: en egen lastebil for produktene lengst ute i linja.','Sale 2: a second truck for the products at the far end of the line.'],
  kob:['Klipp og bøy: armering kappes og bøyes etter tegning for hvert byggeprosjekt – mest verdt per tonn.','Cut & bend: rebar is cut and bent to drawings for each building project – the highest value per tonne.'],
  utlast:['Utlasting: tog og skip betaler mer per tonn enn lastebilen.','Shipping: train and ship pay more per tonne than the truck.']},
 kind:{
  scrap:['Gammelt stål som smeltes om. Elektriske ovner kan lage nytt stål av nesten bare skrap.','Old steel to be remelted. Electric furnaces can make new steel from almost nothing but scrap.'],
  ore:['Jernmalm: jernoksid som må reduseres med koks i masovnen for å bli jern.','Iron ore: iron oxide that has to be reduced with coke in the blast furnace to become iron.'],
  pig:['Masseljern: råjern støpt i små barrer i masseljernsmaskinen. Det selges når stålverket ikke trenger råjernet.','Pig iron: hot metal cast into small bars by the pig casting machine. It is sold when the melt shop doesn’t need the iron.'],
  slag:['Slagg: kalk og oksider som flyter oppå stålet. Den tømmes i slaggpotta og selges knust som pukk.','Slag: lime and oxides floating on top of the steel. It is tipped into the slag pot and sold crushed as aggregate.'],
  elek:['Grafittelektroder fører strømmen inn i lysbueovnen og brennes langsomt opp.','Graphite electrodes carry the current into the arc furnace and slowly burn away.'],
  kokk:['Kokiller: tykke støpejernsformer som stålet størkner i.','Ingot moulds: thick cast-iron moulds that the steel solidifies in.'],
  kokv:['Varme kokiller rett fra strippingen. De må kjøles i kokillelageret før de kan brukes igjen.','Hot moulds straight from stripping. They must cool in the mould store before they can be used again.'],
  kanal:['Kanalstein: ildfaste rør som leder stålet fra trakten under bunnplata og opp i kokillene.','Runner bricks: refractory tubes that lead the steel from the trumpet under the plate up into the moulds.'],
  hette:['Varmholdsmasse: isolerende pulver som holder toppen av blokka flytende lenger, så krympehulrommet havner i toppen som kappes.','Hot-top compound: insulating powder that keeps the top of the ingot liquid longer, so the shrinkage cavity ends up in the top that is cut off.'],
  ingot:['Støpeblokk: stål støpt i kokille. Når stranggjutingen er bygd, blir blokkene små serier spesialstål med høyere pris.','Ingot: steel cast in a mould. Once the caster is built, ingots become small special-steel batches with a higher price.'],
  billet:['Emne: kvadratisk stålstang fra stranggjutingen – råvaren til valseverket.','Billet: a square steel bar from the continuous caster – the feedstock for the rolling mill.'],
  rebar:['Armeringsstål: ribbede stenger som gjør betongen sterk på strekk.','Rebar: ribbed bars that give concrete its tensile strength.'],
  tcore:['Bråkjølt armering: herdet overflate og seig kjerne – sterk og sveisbar.','Quenched rebar: a quenched skin and a tough core – strong and weldable.'],
  coil:['Valstråd: tynn tråd i store ringer, til nett, spiker og trådprodukter.','Wire rod: thin rod in big coils, for mesh, nails and wire products.'],
  mesh:['Armeringsnett: sveisede rutenett til gulv og vegger i betong.','Rebar mesh: welded grids for concrete floors and walls.'],
  bent:['Bøyd armering: kappet og bøyd etter tegning, klar til å legges i forskalingen.','Bent rebar: cut and bent to the drawing, ready to place in the formwork.']},
 era:[
  ['Bessemer-konverteren (oppfunnet 1856) blåser luft gjennom flytende råjern. Forbrenningen av karbon og silisium gir all varmen – ingen brensel. Her: råjern og litt kjøleskrap inn, blås, og tipp for tapping.','The Bessemer converter (invented 1856) blows air through liquid hot metal. Burning off carbon and silicon gives all the heat – no fuel. Here: hot metal and a little cooling scrap go in, it blows, then tilts to tap.'],
  ['Siemens-Martin-ovnen (1860-årene) fyres med forvarmet gass og luft og kan smelte mye skrap; en charge tar timer. Her: skrap og råjern i kasser, og den trenger kalk.','The open-hearth (Siemens-Martin) furnace (1860s) is fired with preheated gas and air and can melt plenty of scrap; a heat takes hours. Here: scrap and hot metal in boxes, and it needs lime.'],
  ['LD-konverteren (1952) blåser rent oksygen ovenfra gjennom en lanse. Rundt 40 minutter per charge, 75–85 % råjern og resten skrap. Trenger kalk og oksygen.','The LD (BOF) converter (1952) blows pure oxygen from above through a lance. About 40 minutes per heat, 75–85% hot metal and the rest scrap. Needs lime and oxygen.'],
  ['Lysbueovnen smelter skrap med lysbuer fra tre grafittelektroder – uten råjern. Her: skrapkurv, strøm, kalk og oksygen.','The electric arc furnace melts scrap with arcs from three graphite electrodes – no hot metal needed. Here: scrap bucket, power, lime and oxygen.'],
  ['UHP-lysbueovnen (ultrahøy effekt) har vannkjølte paneler, stor transformator, oksygenlanser og kullinjeksjon for skumslagg. Under en time fra tapping til tapping.','The UHP (ultra-high power) arc furnace has water-cooled panels, a big transformer, oxygen lances and coal injection for foaming slag. Under an hour from tap to tap.'],
  ['Båndchargering: skrapet mates kontinuerlig gjennom en forvarmingstunnel rett i et flatt bad. Rundt 45 % av stålet blir igjen i ovnen (varm rest), så skrapet smelter ved å synke i flytende stål. Taket er lukket, lysbuen er dekket av skumslagg, og den varme resten gjør drifta jevn med lite flimmer. Tappes gjennom bunnen (EBT).','Conveyor charging: scrap is fed continuously through a preheating tunnel straight into a flat bath. About 45% of the steel stays in the furnace (the hot heel), so the scrap melts by sinking into liquid steel. The roof stays closed, the arc is buried in foaming slag, and the hot heel keeps the running steady with little flicker. Tapped through the bottom (EBT).']],
 rje:[
  ['Masovnen: malm, koks og kalk chargeres på toppen, og varm blåst blåses inn nederst. Koksen brenner og reduserer malmen til flytende råjern med rundt 4 % karbon.','The blast furnace: ore, coke and limestone go in at the top, hot blast is blown in at the bottom. The coke burns and reduces the ore to liquid hot metal with about 4% carbon.'],
  ['Elektrisk råjernsovn: tre Söderberg-elektroder gir varmen, og koksen er bare reduksjonsmiddel. Ingen cowpere – mer effekt (MVA) gir mer råjern.','Electric pig-iron furnace: three Söderberg electrodes supply the heat and the coke is only the reducing agent. No hot stoves – more power (MVA) gives more iron.']],
 drop:{
  conv:['Skrapkasse: skrap til konverteren. Bessemer tar bare litt kjøleskrap; LD tar rundt en femtedel skrap.','Scrap box: scrap for the converter. Bessemer only takes a little cooling scrap; LD takes about one fifth scrap.'],
  box:['Chargeringskasser: skrapet lastes i kasser som chargeringsmaskinen tømmer inn gjennom ovnsdørene.','Charging boxes: scrap is loaded into boxes that the charging machine tips in through the furnace doors.'],
  bucket:['Skrapkurv: kranen løfter kurven over ovnen, taket svinges til side og skrapet slippes ned.','Scrap bucket: the crane lifts the bucket over the furnace, the roof swings aside and the scrap drops in.'],
  belt:['Sjakt ned på chargeringsseksjonen: skrap som bæres hit, havner på chargeringstransportøren. Chargeringskranen gjør jobben av seg selv.','A chute onto the charging section: scrap carried here ends up on the charging conveyor. The charging crane does this job by itself.']},
 /* [Norwegian title, Norwegian text, English title, English text] */
 ring:{
  tap:['TAPP','Stå her når ovnen er klar, så tappes stålet i øsa.','TAP','Stand here when the furnace is ready and the steel is tapped into the ladle.'],
  skip:['Skip','Skipet drar malmen opp skråbanen til toppen av masovnen. Legg malm her.','Skip','The skip hauls ore up the incline to the top of the blast furnace. Drop ore here.'],
  rjsale:['Salg ved malmtoget','Her selges masseljern.','Sale at the ore train','Pig iron is sold here.'],
  rack:['Elektrodestativ','Lysbueovnen bruker opp elektroder. Er stativet tomt, blir lysbuen svak og ovnen smelter saktere.','Electrode rack','The arc furnace uses up electrodes. With an empty rack the arc is weak and the furnace melts slower.'],
  plate:['Bunnplate','Sett kokiller her, pluss kanalstein og varmholdsmasse. Stålet stigstøpes opp i kokillene.','Bottom plate','Put moulds here, plus runner bricks and hot-top compound. The steel is bottom-poured up into the moulds.'],
  koklag:['Kokillelager','Kalde kokiller hentes her til bunnplata. Varme kokiller settes tilbake hit for å kjøles.','Mould store','Cold moulds are taken from here to the bottom plate. Hot moulds come back here to cool.'],
  slagp:['Slaggplass','Tøm slaggpotta her. Slagget selges som pukk.','Slag yard','Empty the slag pot here. The slag is sold as aggregate.'],
  bil1:['Lastebil','Kjøper alle produkter til prisen i salgsavtalen.','Truck','Buys every product at the sales-contract price.'],
  bil2:['Lastebil 2','Kjøper alle produkter til prisen i salgsavtalen.','Truck 2','Buys every product at the sales-contract price.'],
  tog:['Tog','Toget betaler mer per tonn enn lastebilen.','Train','The train pays more per tonne than the truck.'],
  kai:['Kai','Skipet ved kaia betaler best, for eksport.','Quay','The ship at the quay pays the best price, for export.'],
  gjvIn:['Innmating: emner','Legg emner her, så går de inn i gjennomvarmingsovnen.','Feed: billets','Drop billets here and they go into the reheating furnace.'],
  nettIn:['Innmating: kveiler','Legg valstrådkveiler her, så sveises de til nett.','Feed: coils','Drop wire-rod coils here and they are welded into mesh.'],
  kobIn:['Innmating: stenger','Legg armeringsstenger her, så kappes og bøyes de.','Feed: bars','Drop rebar here and it is cut and bent.'],
  y0:['Skraphaug','Fylles av skrapleveransene. Hent skrap her.','Scrap pile','Refilled by scrap deliveries. Pick up scrap here.'],
  y1:['Skraphaug 2','Fylles av skrapleveransene. Hent skrap her.','Scrap pile 2','Refilled by scrap deliveries. Pick up scrap here.'],
  ore:['Malmlager','Malmtoget tipper malm her. Hent malm til skipet.','Ore yard','The ore train tips ore here. Take ore to the skip.'],
  st_elek:['Elektrodelager','Nye grafittelektroder. Bær dem til elektrodestativet ved ovnen.','Electrode store','New graphite electrodes. Carry them to the electrode rack by the furnace.'],
  st_kanal:['Kanalsteinlager','Ferdige kanalsteiner. Bær dem til bunnplata.','Runner-brick store','Ready-made runner bricks. Carry them to the bottom plate.'],
  st_hette:['Varmholdsmasse','Sekker med varmholdsmasse. Bær dem til bunnplata.','Hot-top compound','Bags of hot-top compound. Carry them to the bottom plate.'],
  kokv:['Varme kokiller','Kokiller rett fra strippingen. Bær dem til kokillelageret for å kjøles.','Hot moulds','Moulds straight from stripping. Carry them to the mould store to cool.'],
  pot:['Slaggpotte','Fylles med slagg mens ovnen smelter. Full potte stopper ovnen!','Slag pot','Fills with slag while the furnace melts. A full pot stops the furnace!']},
 sw:{
  rjsw:['Bryter: råjernet går til stålverket, eller det støpes til masseljern for salg. Stå på den for å bytte.','Switch: the hot metal goes to the melt shop, or it is cast into pig iron for sale. Stand on it to flip.'],
  cast:['Bryter: Auto, bare blokkstøping eller bare stranggjuting. Stå på den for å bytte.','Switch: Auto, ingot casting only or the caster only. Stand on it to flip.'],
  mix:['Valseprogram: armering, valstråd eller begge. Stå på den for å bytte.','Mill program: rebar, wire rod or both. Stand on it to flip.']},
 misc:{
  agv:['Transportvogn','En førerløs transportvogn henter ferdigvarer ved haugen og kjører dem til kjøperen eller til neste stasjon. Pengene går rett inn.','Transport car','A driverless transport car takes finished products from the pile to the buyer or to the next station. The money comes in at once.'],
  ctl_furnace:['Ovnspult','Herfra kjøres ovnen. Trykk på pulten (eller STYR) for å ta over: +10 % effekt, og den tapper straks når stålet er klart. Går du fra pulten, tar automatikken over igjen.','Furnace desk','The furnace is run from here. Tap the desk (or TAKE OVER) to take control: +10 % power, and it taps as soon as the steel is ready. Walk away and the automation takes over again.'],
  ctl_caster:['Strengpult','Herfra kjøres stranggjutingen. Ta over for +15 % støpefart så lenge du sitter her.','Caster desk','The continuous caster is run from here. Take over for +15 % casting speed while you sit here.'],
  ctl_ladle:['Øsekranpult','Herfra kjører du øsekranen selv: trykk på pulten, så sender et trykk kroken dit.','Ladle-crane desk','Drive the ladle crane yourself from here: tap the desk, then a tap sends the hook there.'],
  ctl_skrap:['Kranpult','Herfra kjører du skrapkranen selv (dobbel last). Kranførerne sitter her og i førerhuset.','Crane pulpit','Drive the scrap crane yourself from here (double load). The crane operators sit here and in the cab.'],
  ctl_mag:['Kranpult','Herfra kjører du magnetkranen selv (dobbel last).','Crane pulpit','Drive the magnet crane yourself from here (double load).'],
  pult:['Operatørpult','Operatørene styrer stasjonen herfra. Ingen bærer – kraner, bånd og transportvogner flytter alt.','Operator desk','The operators run the station from here. Nobody carries – cranes, conveyors and transport cars move everything.'],
  cr:['Kontrollrom','Ovnen, øsekranen og strengen kjøres herfra. Operatørene sitter ved pultene; du kan ta over en pult selv.','Control room','The furnace, the ladle crane and the caster are run from here. The operators sit at the desks; you can take over a desk yourself.'],
  mb:['','Lagt ned: kald, uten røyk og lys. Den koster litt i vedlikehold hvert minutt. Riv den for å frigjøre tomta og få litt skrap tilbake.','','Mothballed: cold, no smoke or light. It costs a little upkeep every minute. Demolish it to free the plot and get some scrap back.'],
  mbre:['','Den kan startes igjen når en senere ovn trenger den.','','It can be restarted when a later furnace needs it.'],
  dem:['Riv','Betal for å rive det gamle anlegget: tomta blir ledig, vedlikeholdet stopper, og litt skrap går tilbake til skrapplassen.','Demolish','Pay to tear down the old plant: the plot is freed, the upkeep stops and some scrap goes back to the scrap yard.'],
  rst:['Start igjen','Et nedlagt anlegg kan startes igjen når en senere ovn trenger det. LD-konverteren med torpedovognene kommer tilbake med den elektriske smelteovnen.','Restart','A mothballed plant can be restarted when a later furnace needs it. The LD converter with its torpedo cars returns with the electric smelting furnace.'],
  torp:['Torpedovogn','Isolert jernbanevogn som frakter rundt 1450 °C varmt råjern fra masovnen til stålverket.','Torpedo car','An insulated rail car that carries hot metal at about 1450 °C from the blast furnace to the melt shop.'],
  ladle:['Støpeøse','Stålkappe med ildfast foring. Den tar imot stålet fra ovnen, og kranen bærer den til øseovnen og støpingen.','Ladle','A steel shell with a refractory lining. It takes the steel from the furnace, and the crane carries it to the ladle furnace and to casting.'],
  lcar:['Øsevogn','Øsevogna ruller øsa på skinner fra tappestedet under ovnen til øseovnen, der stålet behandles mens øsa står på vogna. Øsekranen løfter den ferdige øsa til støpingen og setter den tomme på øsestolen, der vogna henter den og kjører den tilbake under tappen.','Ladle car','The ladle car rolls the ladle on rails from the tap under the furnace to the ladle furnace, where the steel is treated with the ladle still on the car. The ladle crane lifts the treated ladle on to casting and sets the empty one on the ladle stand, where the car picks it up and takes it back under the tap.'],
  hmL:['Råjernsøse','Torpedovogna heller råjernet i denne øsa, som så chargerer det i ovnen.','Hot-metal ladle','The torpedo car pours its iron into this ladle, which then charges it into the furnace.'],
  pigm:['Masseljernsmaskin','En kjede av små former. Råjern som ikke går til stålverket, støpes her til masseljern.','Pig casting machine','A chain of small moulds. Hot metal that doesn’t go to the melt shop is cast into pig iron here.'],
  train:['Malmtog','Malmtoget tipper jernmalm i malmlageret.','Ore train','The ore train tips iron ore into the ore yard.'],
  desk:['Operatørpult','Ledige hjelpere venter her når en kran eller rullebane gjør jobben deres, og går tilbake til bæring når det trengs.','Operator desk','Idle helpers wait here while a crane or conveyor does their job, and go back to carrying when needed.'],
  tapdesk:['Tapperpult','Her sitter tapperen og tapper ovnen for deg når den er klar.','Tapper’s desk','The tapper sits here and taps the furnace for you when it is ready.'],
  build:['','Gå på ruta for å betale; pengene går inn litt etter litt.','','Stand on the pad to pay; the money goes in bit by bit.'],
  prestige:['Nytt verk','Start et nytt stålverk fra bunnen og få ekspertise som øker all inntekt for alltid.','New Mill','Start a new steel mill from scratch and earn expertise that raises all income for good.'],
  plot:['Tomt','Her kommer {0}.','Plot','{0} will be built here.'],
  closed:['','Råjernsverket ble lagt ned ved omleggingen. Stålet lages nå av skrap.','','The ironworks was closed at the conversion. Steel is now made from scrap.'],
  gauge:['','','',''],
  helper:['Hjelper','','Helper','']},
 /* the continuous caster's machines, upstream to downstream */
 cast:{
  turret:['Øsetårn','Et dreibart tårn med to armer. Kranen setter den fulle øsa på den ledige armen bak. Når øsa over fordeleren er tom, svinger tårnet 180°, og neste øse støper uten stopp. Den tomme løftes av bak.','Ladle turret','A slewing turret with two arms. The crane sets the full ladle on the free arm at the back. When the ladle over the tundish is empty, the turret swings 180° and the next ladle casts without a stop. The empty one is lifted off at the back.'],
  shroud:['Skjermrør','Keramisk rør fra øsas glideluke ned i fordeleren. Det skjermer stålet mot lufta, så det ikke tar opp oksygen og nitrogen.','Ladle shroud','A ceramic tube from the ladle’s slide gate down into the tundish. It shields the steel from the air so it does not pick up oxygen and nitrogen.'],
  tundish:['Fordeler','Et ildfast foret trau med lokk, på en vogn. Det fordeler stålet jevnt til alle strengene og holder et jevnt nivå, så slagg og urenheter flyter opp. Det holder støpingen i gang mens tårnet bytter øse.','Tundish','A refractory-lined trough with a lid, on a car. It spreads the steel evenly to all strands and keeps a steady level so slag and inclusions float up. It keeps casting going while the turret changes ladles.'],
  mould:['Kokiller','Vannkjølte kobberrør, ett per streng. Stålet størkner til et skall mot kobberet, og kokilla oscillerer opp og ned så skallet ikke henger fast.','Moulds','Water-cooled copper tubes, one per strand. The steel freezes into a shell against the copper, and the mould oscillates up and down so the shell does not stick.'],
  spray:['Sekundærkjøling','Vanndyser spruter på strengen under kokilla til den er størknet helt inn. Dampen stiger opp av kammeret.','Spray chamber','Water nozzles spray the strand below the mould until it is solid all the way through. Steam rises from the chamber.'],
  wsu:['Uttrekk og retting','Drevne valsepar trekker strengen ut av kokilla med støpefarten og retter den ut fra buen til et rett emne. Farten følger stålet som kommer: er neste øse sen, går strengene saktere (og noen stenges om nødvendig), så fordeleren ikke går tom under øsebyttet.','Withdrawal and straightening','Driven roll pairs pull the strand out of the mould at casting speed and straighten it from the arc into a straight bar. The speed follows the steel supply: when the next ladle is late the strands slow down (closing some if needed) so the tundish never runs dry during the ladle change.'],
  cutter:['Kapping','Strengen kappes i emnelengder mens den går. En hydraulisk saks klipper den; en skjærebrenner kjører med strengen og brenner den av med mindre tap av stål.','Cutting','The moving strand is cut into billet lengths. A hydraulic shear chops it; a cutting torch travels with the strand and burns through with less steel lost.'],
  bed:['Kjøleseng','Hakkede bjelker flytter emnene steg for steg over senga mens de kjøles fra rødglødende til grå. Herfra går de til gjennomvarming eller salg.','Cooling bed','Notched beams walk the billets step by step across the bed while they cool from red-hot to grey. From here they go to reheating or to sale.']},
 /* the Consteel line: [Norwegian title, Norwegian text, English title, English text] */
 cs:{
  charge:['Chargeringsseksjon','Den åpne delen av chargeringstransportøren, langs skrapplassen. Magnetkranen legger skrapet i jevne løft over hele lengden, og laget kryper videre mot tunnelen.','Charging section','The open part of the charging conveyor, alongside the scrap yard. The magnet crane lays the scrap in even lifts over its whole length, and the layer creeps on toward the tunnel.'],
  conveyor:['Oscillerende transportør','Ikke et bånd på ruller, men et langt stålkar som ristes av en drivenhet: langsomt fram, raskt tilbake. Skrapet glir litt fram for hvert slag. Farten følger hvor fort ovnen smelter.','Oscillating conveyor','Not a belt on rollers but a long steel pan shaken by a drive unit: slowly forward, quickly back. The scrap slides a little further with every stroke. The speed follows how fast the furnace melts.'],
  seal:['Dynamisk tetning','Ved tunnelinngangen holder en vifte og tunge kjettinggardiner falsk luft ute, så avgassen ikke blandes med kald luft.','Dynamic seal','At the tunnel entry a fan and heavy chain curtains keep false air out, so the off-gas is not diluted with cold air.'],
  tunnel:['Forvarmingstunnel','Avgassen fra ovnen (rundt 1200 °C) strømmer tilbake gjennom tunnelen, mot skrapet. Skrapet blir varmt – mørkerødt mot ovnsenden – og trenger mindre strøm for å smelte. Raskere bånd gir kortere tid i tunnelen.','Preheating tunnel','The off-gas from the furnace (about 1200 °C) flows back through the tunnel, against the scrap. The scrap heats up – dull red toward the furnace end – and needs less electricity to melt. A faster conveyor means less time in the tunnel.'],
  inj:['Etterforbrenning','Seks injektorer blåser luft inn i tunnelen. CO i avgassen brenner til CO₂ og gir ekstra varme til skrapet. Lufta styres etter oksygenet i gassen ut av tunnelen.','Post-combustion','Six injectors blow air into the tunnel. The CO in the off-gas burns to CO₂ and gives the scrap extra heat. The air is set by the oxygen in the gas leaving the tunnel.'],
  duct:['Avgasskanal','Avgassen går ut i chargeringsenden av tunnelen – ikke gjennom ovnstaket – og opp en vannkjølt kanal til et utskillerkammer, der gnister og grovt støv faller ut.','Off-gas duct','The off-gas leaves at the charging end of the tunnel – not through the furnace roof – and goes up a water-cooled duct to a drop-out box, where sparks and coarse dust fall out.'],
  filter:['Posefilter og pipe','Gassen renses i et posefilter: støvet fanges på tekstilposer som blåses rene med trykkluftstøt. En sugevifte trekker gassen gjennom hele anlegget og ut i pipa.','Bag filter and stack','The gas is cleaned in a bag filter: the dust is caught on fabric bags that are cleaned by pulses of compressed air. An induced-draught fan pulls the gas through the whole plant and out of the stack.'],
  car:['Koblingsvogn','Den siste, teleskopiske delen av transportøren, på egen vogn. Den går inn gjennom en åpning i ovnsveggen, og skrapet faller rett i det flytende badet. Tuppen er den mest utsatte delen.','Connecting car','The last, telescopic part of the conveyor, on its own carriage. It runs in through an opening in the furnace shell, and the scrap drops straight into the liquid bath. Its tip is the hardest-worked part.'],
  door:['Slaggdør','Skumslagget renner hele tiden over terskelen i slaggdøra og ned i slagg-gropa. Oksygen og kull holder slagget skummende, så lysbuen er dekket.','Slag door','The foaming slag runs over the slag door sill all the time and down into the slag pit. Oxygen and carbon keep the slag foaming, so the arc stays covered.'],
  pit:['Slagg-grop','Slagget renner hit og stivner. En hjullaster tømmer gropa, og slagget selges som pukk. Full grop stopper ovnen!','Slag pit','The slag runs in here and solidifies. A wheel loader clears the pit, and the slag is sold as aggregate. A full pit stops the furnace!'],
  robot:['Temperaturrobot','Roboten henter en sonde med papphylse fra magasinet, skyver lansen inn gjennom slaggdøra og ned i badet i noen sekunder, leser temperaturen og slipper den brente sonden i en kasse.','Temperature robot','The robot takes a probe with a cardboard sleeve from the magazine, pushes the lance in through the slag door into the bath for a few seconds, reads the temperature and drops the burnt probe in a bin.'],
  crane:['Chargeringskran','Traverskran med stor løftemagnet. Den henter skrap i skrapplassen og legger løftene jevnt langs chargeringsseksjonen – ingen trenger å bære skrap. Du kan styre den selv for dobbel last.','Charging crane','An overhead crane with a big lifting magnet. It takes scrap from the yard and lays the lifts evenly along the charging section – nobody needs to carry scrap. Drive it yourself for a double load.']},
 crane:{
  skrap:['Traverskran med løftemagnet som henter skrap av seg selv. Du kan styre den selv for dobbel last.','An overhead crane with a lifting magnet that fetches scrap by itself. Drive it yourself for a double load.'],
  malm:['Gripekran som flytter malm til skipet av seg selv. Du kan styre den selv for dobbel last.','A grab crane that moves ore to the skip by itself. Drive it yourself for a double load.'],
  ose:['Øsekranen løfter fulle øser fra tappen til øseovnen og støpingen, og tomme øser tilbake.','The ladle crane lifts full ladles from the tap to the ladle furnace and casting, and empty ones back.'],
  mag:['Magnetkran som løfter emner fra kjølesenga til gjennomvarmingsovnen.','A magnet crane that lifts billets from the cooling bed to the reheating furnace.']}};
/* every reserve plot shares one text */
for(const z of ZONES)if(z.mbp)IX.zone[z.id]=['Reservetomt: her settes et gammelt anlegg når et nytt verk bygges. Lagt ned står det mørkt og koster litt vedlikehold, til du river det.','Reserve plot: an old plant is put here when a new one is built. Mothballed it stands dark and costs a little upkeep until you demolish it.'];
/* ---- Phase 4 explanations (hydrogen DRI 2030, electric smelting 2035) ---- */
Object.assign(IX.up,{
 elyz:['Flere elektrolysestakker i hallen. Strøm og vann blir hydrogen og oksygen; hvert nivå gir mer hydrogen til sjaktovnen.','More electrolyser stacks in the hall. Power and water become hydrogen and oxygen; each level makes more hydrogen for the shaft furnace.'],
 h2st:['Hydrogenlager: tanker først, så et foret fjellhall-lager. Lageret jevner ut produksjonen, og større lager gir mer hydrogen per minutt til sjaktovnen.','Hydrogen storage: tanks first, then a lined rock cavern. The store evens out production, and a bigger store delivers more hydrogen per minute to the shaft furnace.'],
 shaft:['Større sjaktovn: pelletsene synker ned gjennom ovnen mens varmt hydrogen strømmer opp og tar oksygenet. Hvert nivå gir mer DRI per minutt.','A bigger shaft furnace: the pellets sink down through the furnace while hot hydrogen flows up and takes their oxygen. Each level makes more DRI per minute.'],
 pellet:['Flere pelletstog per time til pelletlageret. Sjaktovnen trenger rundt 1,4 tonn pellets per tonn DRI.','More pellet trains per hour to the pellet yard. The shaft furnace needs about 1.4 tonnes of pellets per tonne of DRI.'],
 dribelt:['Raskere galleribånd for varm DRI fra sjaktovnen til chargeringsbåndet ved lysbueovnen.','A faster gallery conveyor for hot DRI from the shaft furnace to the arc furnace’s charging conveyor.'],
 esfmw:['Mer effekt i den elektriske smelteovnen: seks elektroder på rad smelter DRI til råjern. Mer MW gir mer råjern til konverteren.','More power for the electric smelting furnace: six electrodes in a row melt DRI into hot metal. More MW means more hot metal for the converter.'],
 etorp:['Større og raskere torpedovogner mellom den elektriske smelteovnen og LD-konverteren.','Bigger and faster torpedo cars between the electric smelting furnace and the LD converter.'],
 etorpn:['En torpedovogn til på linja, så råjernet aldri blir stående og vente på en tom vogn.','One more torpedo car on the line, so the hot metal never waits for an empty car.']});
IX.op.dri=['DRI-operatører kjører elektrolysen, lageret og sjaktovnen fra pulten. Hver operatør gir litt mer hydrogen og DRI.','DRI operators run the electrolysis, the store and the shaft furnace from the desk. Each operator gives a little more hydrogen and DRI.'];
IX.hire.dri=['DRI-operatører sitter ved pulten i DRI-anlegget – her bærer ingen noe.','DRI operators sit at the desk in the DRI plant – nobody carries anything here.'];
Object.assign(IX.zone,{
 dri:['Hydrogen-DRI: elektrolysører lager hydrogen, et lager jevner det ut, og sjaktovnen reduserer jernmalmpellets til jernsvamp (DRI). Pipa slipper ut vanndamp, ikke CO₂.','Hydrogen DRI: electrolysers make hydrogen, a store evens it out, and the shaft furnace reduces iron-ore pellets to sponge iron (DRI). The stack lets out water vapour, not CO₂.'],
 esf:['Elektrisk smelteovn: en lang, rektangulær ovn med seks elektroder på rad. DRI smelter til grønt råjern som går med torpedovogn til LD-konverteren; slagget renner ut i den andre enden.','Electric smelting furnace: a long rectangular furnace with six electrodes in a row. DRI melts into green hot metal that goes by torpedo car to the LD converter; the slag runs out at the other end.']});
IX.era[6]=['Hydrogen-DRI (rundt 2030): den samme båndchargerte lysbueovnen, men nå mates den også med varm DRI laget med hydrogen. Mer DRI gir renere stål og lavere CO₂, men krever mer strøm og kalk.','Hydrogen DRI (around 2030): the same conveyor-fed arc furnace, now also fed hot DRI made with hydrogen. More DRI gives cleaner steel and lower CO₂, but takes more power and lime.'];
IX.era[7]=['Elektrisk smelteovn (rundt 2035): DRI smeltes til grønt råjern i en elektrisk ovn, og den gamle LD-konverteren er startet igjen for å blåse det til stål med litt skrap – som i LD-tida, bare uten koks.','Electric smelting (around 2035): DRI is melted into green hot metal in an electric furnace, and the old LD converter is restarted to blow it into steel with a little scrap – like in the LD days, only without coke.'];
IX.sw.drimix=['Bryter: hvor stor del av chargen som er DRI – 30, 50 eller 70 %. Mer DRI gir renere stål og lavere CO₂, men trenger mer strøm og kalk. Stå på den for å bytte.','Switch: how much of the charge is DRI – 30, 50 or 70%. More DRI gives cleaner steel and lower CO₂, but needs more power and lime. Stand on it to flip.'];
IX.sw.pgrade=['Bryter: DR-pellets (rene) eller billigere masovnspellets. Smelteovnen tåler mer gangart enn lysbueovnen: masovnspellets gir mer pellets per kontrakt, men mer slagg og strøm. Stå på den for å bytte.','Switch: DR-grade pellets (clean) or cheaper blast-furnace pellets. The smelting furnace takes more gangue than the arc furnace: blast-furnace pellets mean more pellets per contract, but more slag and power. Stand on it to flip.'];
IX.misc.torp7=['Torpedovogn','Isolert jernbanevogn som frakter grønt råjern fra den elektriske smelteovnen til LD-konverteren.','Torpedo car','An insulated rail car that carries green hot metal from the electric smelting furnace to the LD converter.'];
IX.misc.rebuild=['Bygg opp igjen','LD-konverteren ble revet. Den elektriske smelteovnen trenger en konverter – her bygges en ny i stålverket.','Rebuild','The LD converter was demolished. The electric smelting furnace needs a converter – a new one is built here in the melt shop.'];
IX.p4={
 hall:['Elektrolysehall','Rader med elektrolysestakker spalter vann til hydrogen og oksygen med strøm. Hydrogenet går til lageret.','Electrolyser hall','Rows of electrolyser stacks split water into hydrogen and oxygen with electricity. The hydrogen goes to the store.'],
 tank:['Hydrogenlager','Trykktanker for hydrogen. Lageret tar unna når sjaktovnen bruker mindre, og gir mer når den bruker mer.','Hydrogen store','Pressure tanks for hydrogen. The store takes up the surplus when the shaft furnace uses less and gives more when it uses more.'],
 cav:['Fjellhall','Et foret fjellrom under bakken: et mye større hydrogenlager enn tankene, med mer uttak til sjaktovnen.','Rock cavern','A lined cavern under the ground: a much bigger hydrogen store than the tanks, with more flow to the shaft furnace.'],
 shaft:['Sjaktovn (DRI)','Pellets chargeres på toppen og synker ned. Varmt hydrogen blåses inn nederst og tar oksygenet fra malmen. Ut kommer jernsvamp (DRI) – og vanndamp i stedet for CO₂.','Shaft furnace (DRI)','Pellets are charged at the top and sink down. Hot hydrogen is blown in low down and takes the oxygen from the ore. Out comes sponge iron (DRI) – and water vapour instead of CO₂.'],
 stack:['Damp-pipe','Toppgassen vaskes og kjøles; vannet kondenseres, og det som går ut av pipa er vanndamp. Ubrukt hydrogen går tilbake i ovnen.','Steam stack','The top gas is scrubbed and cooled; the water condenses, and what leaves the stack is water vapour. Unused hydrogen goes back into the furnace.'],
 bin:['Varm DRI-silo','Silo for varm DRI rett fra sjaktovnen. Herfra går DRI-en til lysbueovnen eller den elektriske smelteovnen.','Hot DRI bin','A bin for hot DRI straight from the shaft furnace. From here the DRI goes to the arc furnace or the electric smelting furnace.'],
 pyard:['Pelletlager','Jernmalmpellets kommer med tog og tippes her. Et bånd tar dem opp til toppen av sjaktovnen.','Pellet yard','Iron-ore pellets arrive by train and are tipped here. A conveyor takes them up to the top of the shaft furnace.'],
 gal:['DRI-galleri','Et lukket, isolert galleribånd bærer varm DRI fra sjaktovnen til chargeringsbåndet. Der legges DRI-en under skrapet, opp til andelen du har valgt.','DRI gallery','A closed, insulated gallery conveyor carries hot DRI from the shaft furnace to the charging conveyor. There the DRI is laid under the scrap, up to the share you chose.'],
 esf:['Elektrisk smelteovn','Lang, rektangulær ovn med seks Söderberg-elektroder på rad. DRI faller ned fra siloene over ovnen og smelter i slagget; råjernet tappes i østenden.','Electric smelting furnace','A long rectangular furnace with six Söderberg electrodes in a row. DRI drops from the bins above and melts in the slag; the hot metal is tapped at the east end.'],
 esfbin:['DRI-siloer','Tre siloer over ovnen mater DRI jevnt inn langs hele ovnen.','DRI bins','Three bins above the furnace feed DRI evenly along the whole furnace.'],
 esfslag:['Slaggtapping','Slagget renner kontinuerlig ut i vestenden. Det granuleres og selges til sementverket.','Slag tapping','The slag runs out continuously at the west end. It is granulated and sold to the cement works.'],
 esftap:['Råjernstapping','Grønt råjern tappes i torpedovogna. Torpedovognene kjører det til LD-konverteren.','Hot-metal tapping','Green hot metal is tapped into the torpedo car. The torpedo cars take it to the LD converter.']};
function p4Nums(id){const D=S.dri;switch(id){
 case'hall':return t_('{0} MW · {1} t H₂/min',Math.round(elyMW()),tf(h2Rate()*60))+(DRI.h2run<.95?' · '+t_('lageret er fullt'):'');
 case'tank':case'cav':return t_('{0}/{1} t H₂ · uttak {2} t/min',tf(D.h2),tf(h2Cap()),tf(h2Draw()*60));
 case'shaft':case'stack':return t_('{0} av {1} t/min DRI',tf(DRI.rate*60),tf(shaftCap()*60));
 case'bin':return t_('{0}/{1} t',tf(D.bin),tf(binCap()));
 case'pyard':return t_('{0}/{1} t · {2} t/min inn',tf(D.pel),tf(pelCap()),tf(pelRate()*60));
 case'gal':return t_('{0} t/min · maks {1} t/min',tf(rate('f:dri>ovn')),tf(driBelt()*60))+' · '+t_('DRI-andel {0} %',Math.round(DRI.sh*100));
 case'esf':case'esfbin':return era()===7?t_('{0} MW · {1} t/min råjern',Math.round(esfMW()),tf(ESF.rate*60)):t_('Venter på LD-konverteren');
 case'esfslag':return kr(rate('v:esf'),'/min');case'esftap':return t_('{0} t i ovnen',tf(S.rj.hearth))}return''}
function p4Hit(wx,wy){const o=(id,x,y)=>({type:'p4',key:'p4:'+id,id,x,y}),g=P4G,E=ESFG;
 if(B_('h2')&&!mbOn('dri')&&mbSt('dri')!=='gone'){const h=g.hall;if(inR(wx,wy,h.x0,h.y0,h.x1-h.x0,h.y1-h.y0))return o('hall',(h.x0+h.x1)/2,(h.y0+h.y1)/2);
  for(const t of g.tank.slice(0,nTank()))if(hyp(wx-t.x,wy-t.y)<t.r+6)return o('tank',t.x,t.y);
  if(lv('h2st')>=3&&inR(wx,wy,g.cav.x,g.cav.y,g.cav.w,g.cav.h))return o('cav',g.cav.x+g.cav.w/2,g.cav.y+g.cav.h/2);
  if(hyp(wx-g.shaft.x,wy-g.shaft.y)<g.shaft.R+10)return o('shaft',g.shaft.x,g.shaft.y);if(hyp(wx-g.stack.x,wy-g.stack.y)<26)return o('stack',g.stack.x,g.stack.y);
  if(hyp(wx-g.bin.x,wy-g.bin.y)<g.bin.r+8)return o('bin',g.bin.x,g.bin.y);
  if(inR(wx,wy,g.yard.x0,g.yard.y0,g.yard.x1-g.yard.x0,g.yard.y1-g.yard.y0))return o('pyard',g.pile.x,g.pile.y);
  if(era()===6){const G2=g.gal;for(let i=1;i<G2.length;i++){const a=G2[i-1],b=G2[i];if(inR(wx,wy,min(a[0],b[0])-10,min(a[1],b[1])-10,Math.abs(b[0]-a[0])+20,Math.abs(b[1]-a[1])+20))return o('gal',wx,wy)}}}
 if(B_('esf')&&!mbOn('esf')&&mbSt('esf')!=='gone'){if(inR(wx,wy,E.x0,E.y0,E.x1-E.x0,E.y1-E.y0))return o('esf',(E.x0+E.x1)/2,E.cy);for(const x of E.bins)if(hyp(wx-x,wy-E.binY)<26)return o('esfbin',x,E.binY);
  if(hyp(wx-E.slag.x,wy-E.slag.y)<34||inR(wx,wy,E.slag.x,E.cy-16,E.x0-E.slag.x,32))return o('esfslag',E.slag.x,E.slag.y);if(inR(wx,wy,E.x1,E.cy-60,ESFG.tapX-E.x1,80))return o('esftap',E.x1+10,E.cy)}
 return null}
/* ---- Phase 3 explanations: [Norwegian, English] (up/zone/kind) and [no title, no text, en title, en text] (p3 equipment) ---- */
Object.assign(IX.up,{
 sort:['En sorteringslinje med kamera, laser og luftdyser plukker kobber og annet rask ut av skrapleveransene. Renere skrap gir bedre stål: høyere pris og færre overflatesprekker. Hvert nivå sorterer mer.','A sorting line with cameras, a laser and air jets picks copper and other tramp material out of the scrap deliveries. Cleaner scrap makes better steel: a higher price and fewer surface cracks. Each level sorts more.'],
 tdheat:['Induksjons- og plasmavarme i fordeleren holder overhetingen nær 30 °C. For kaldt gror dysene igjen, for varmt må strengen støpe saktere. Hvert nivå holder temperaturen jevnere.','Induction and plasma heating in the tundish keeps the superheat near 30 °C. Too cold and the nozzles clog, too hot and the strand must cast slower. Each level holds the temperature steadier.'],
 slagdet:['Et IR-kamera ser etter slagg i strålen fra øsa og stenger glideluka før slagget renner inn i fordeleren. Færre feilemner.','An IR camera watches the stream from the ladle for slag and closes the slide gate before slag runs into the tundish. Fewer defective billets.'],
 ems:['Elektromagnetisk omrøring: spoler rundt kokillene rører i det flytende stålet, så strukturen blir jevnere. Færre feil – også når strengen går fort.','Electromagnetic stirring: coils around the moulds stir the liquid steel so the structure is more even. Fewer defects – also when the strand runs fast.'],
 hss:['Hurtigstreng: hver streng støper 12 % fortere per nivå. Uten omrøring gir høy fart flere feilemner.','High-speed strand: every strand casts 12 % faster per level. Without stirring, high speed gives more defective billets.'],
 insp:['Inspeksjonsbue over strengen: kameraer og laser leser overflaten på det glødende emnet. Feilemner merkes med rød ring og slipes av en robot på kjølesenga i stedet for å selges billig.','An inspection arch over the strand: cameras and a laser read the surface of the glowing billet. Defective billets are marked with a red ring and ground by a robot on the cooling bed instead of being sold cheap.'],
 pass:['Digitalt produktpass: hver bunt får en QR-kode som viser hvor stålet kommer fra og hvor mye CO₂ det har kostet. Kundene betaler en grønn pris – jo lavere CO₂ per tonn, jo høyere.','Digital product passport: every bundle gets a QR code that shows where the steel comes from and how much CO₂ it cost. Buyers pay a green price – the lower the CO₂ per tonne, the higher.'],
 endless:['Endeløs støp til armering: den nederste strengen kappes ikke, men går rett gjennom en induksjonsvarmer, valsestoler med hver sin motor og vannkjøling i linja. Ingen kjøleseng og ingen oppvarmingsovn – mindre energi og CO₂.','Endless cast-to-rebar: the bottom strand is not cut but runs straight through an induction heater, stands with their own motors and an inline water quench. No cooling bed and no reheating furnace – less energy and CO₂.'],
 elspd:['Raskere valser i den endeløse linja. Støpefart og valsefart må passe: går strengen fortere enn valsene, kappes resten til emner.','Faster stands on the endless line. Casting and rolling speed must match: if the strand runs faster than the stands, the rest is cut to billets.'],
 loop:['En sløyfe mellom strengen og valsene tar opp forskjellen i fart og holder strengen mens valsene byttes. Uten nok sløyfe må strengen kappes til emner.','A loop between the strand and the stands takes up the difference in speed and holds the strand while the rolls are changed. Without enough loop the strand must be cut to billets.'],
 robot:['Robotceller ved enden av den endeløse linja: to roboter bøyer stengene etter tegning, og to sveiseroboter lager armeringskurver – det mest verdifulle produktet.','Robot cells at the end of the endless line: two robots bend the bars to drawings, and two welding robots build rebar cages – the most valuable product.'],
 robspd:['Raskere robotceller: flere kurver per minutt.','Faster robot cells: more cages per minute.'],
 slagmill:['Slagget knuses og males til sementerstatning i stedet for å selges som pukk. Hvert nivå gir høyere slaggpris.','The slag is crushed and ground into a cement substitute instead of being sold as aggregate. Each level raises the slag price.'],
 dheat:['Spillvarme fra kjølevannet og avgassen går til fjernvarme. Det gir inntekt hvert sekund ovnen går – mer jo større effekt.','Waste heat from the cooling water and the off-gas goes to district heating. It earns money every second the furnace runs – more the higher its power.'],
 co2:['CO₂-fangst: et absorpsjonsanlegg vasker CO₂ ut av avgassen, og en kompressor fyller den på tank. Lavere CO₂ per tonn gir høyere grønn pris.','CO₂ capture: an absorber washes the CO₂ out of the off-gas and a compressor fills it into a tank. Lower CO₂ per tonne gives a higher green price.'],
 twin:['Digital tvilling: en levende modell av hele verket i kontrollrommet. Operatørene planlegger smartere, så alt stål selges litt bedre. Det øverste trinnet for operatørene.','Digital twin: a live model of the whole plant in the control room. The operators plan smarter, so all steel sells a little better. The top tier for the operators.']});
Object.assign(IX.zone,{
 endl:['Endeløs linje: strengen går rett fra stranggjutingen gjennom varmer, valser og vannkjøling til ferdige bunter med armering.','Endless line: the strand runs straight from the caster through heater, stands and quench to finished bundles of rebar.'],
 qa:['Støpeteknikk: strømforsyning og datamaskiner for fordelervarme, slaggvakt, omrøring, hurtigstreng og inspeksjon. Her styres overheting og emnekvalitet.','Casting tech: power supplies and computers for tundish heating, slag detection, stirring, the high-speed strand and inspection. This is where superheat and billet quality are managed.'],
 byp:['Biprodukter: det som før var avfall blir inntekt – slagg blir sement, spillvarme blir fjernvarme, og CO₂ fanges.','By-products: what used to be waste becomes income – slag becomes cement, waste heat becomes district heating, and CO₂ is captured.'],
 rob:['Robotceller: bøyeroboter og sveiseroboter lager armeringskurver av armeringen fra den endeløse linja. Førerløse vogner kjører dem ut.','Robot cells: bending and welding robots make rebar cages from the endless-line rebar. Driverless cars take them out.']});
Object.assign(IX.kind,{
 ebar:['Armering rett fra den endeløse linja – vannkjølt i linja, kappet og buntet. Ingen oppvarmingsovn betyr mindre CO₂.','Rebar straight off the endless line – quenched inline, cut and bundled. No reheating furnace means less CO₂.'],
 cage:['Ferdig sveiste armeringskurver som går rett til byggeplassen – mest verdt per tonn.','Welded rebar cages that go straight to the building site – the most valuable per tonne.']});
IX.p3={
 grinder:['Sliperobot','Roboten sliper bort sprekker og slaggflekker på emnene som inspeksjonsbuen merket med rød ring. Litt stål går tapt, men emnet selges til full pris.','Grinding robot','The robot grinds away cracks and slag spots on the billets the inspection arch marked with a red ring. A little steel is lost, but the billet sells at full price.'],
 shtag:['Overheting i fordeleren','Hvor mange grader stålet i fordeleren er over størkningstemperaturen. Vinduet er 20–40 °C: kaldere gror dysene igjen, varmere må strengen støpe saktere. Fordelervarme holder det jevnt.','Tundish superheat','How many degrees the steel in the tundish is above its solidification temperature. The window is 20–40 °C: colder and the nozzles clog, hotter and the strand must cast slower. Tundish heating keeps it steady.'],
 el_loop:['Sløyfe','Strengen buer seg opp når den kommer fortere enn valsene tar den. Sløyfa holder også strengen mens valsene byttes.','Loop','The strand bows up when it arrives faster than the stands take it. The loop also holds the strand while the rolls are changed.'],
 el_heat:['Induksjonsvarmer','Kobberspoler varmer strengen jevnt opp til valsetemperatur med strøm – i stedet for en gassfyrt oppvarmingsovn.','Induction heater','Copper coils heat the strand evenly to rolling temperature with electricity – instead of a gas-fired reheating furnace.'],
 el_stands:['Valsestoler','Åtte valsestoler, annenhver vannrett og loddrett, hver med sin egen motor. Stangen blir tynnere for hvert stikk.','Roll stands','Eight stands, alternately horizontal and vertical, each with its own motor. The bar gets thinner with every pass.'],
 el_quench:['Vannkjøling i linja','Kraftig vannkjøling gir hard overflate og seig kjerne – sterk armering uten dyre legeringer.','Inline quench','Strong water cooling gives a hard skin and a tough core – strong rebar without expensive alloys.'],
 el_shear:['Laser og saks','En laser måler dimensjonen, og en flygende saks kapper stangen i lengder mens den går.','Laser and shear','A laser measures the size, and a flying shear cuts the bar to length while it runs.'],
 el_bund:['Bunting','Stengene samles og bindes til bunter. Med produktpass får hver bunt en QR-kode.','Bundler','The bars are gathered and tied into bundles. With the product passport each bundle gets a QR code.']};
/* live numbers for the Phase 3 bubbles */
function p3Nums(id){const dq=t_('{0} % feil',Math.round(P3.dq*100))+' · '+t_('{0} slipt',fmt(S.st.ground||0));
 if(id==='tdheat'||id==='shtag')return t_('Fordeler {0} °C · vindu 20–40 °C',Math.round(CAST.sh));
 if(id==='slagdet'||id==='ems'||id==='hss'||id==='insp'||id==='grinder')return dq;
 if(id.startsWith('el_')||id==='endless'||id==='loop'||id==='elspd')return t_('Strengfart {0} · valser {1} t/min · sløyfe {2} %',tf(EL.feedE*60)+' t/min',tf(elRate()*60),Math.round(clamp(EL.buf/max(.01,bufCap()),0,1)*100))+(elDiv()>.02?' · '+t_('{0} % til emner',Math.round(elDiv()*100)):'');
 if(id==='slagmill')return t_('Slaggpris ×{0}',L1(slagK()))+' · '+kr(rate('v:slagc'),'/min');if(id==='dheat')return kr(rate('v:dheat'),'/min');
 if(id==='co2'||id==='pass')return t_('CO₂ {0} t/t · grønn pris ×{1}',dsep(co2t().toFixed(2)),dsep(greenK().toFixed(2)));
 if(id==='robot'||id==='robspd')return t_('{0} i kø',nodeQ('rob'))+' · '+tf(rate('o:rob'))+' t/min';
 if(id==='sort')return t_('Cu {0} % · pris ×{1}',dsep(cuPct().toFixed(2)),dsep(cuK().toFixed(2)));if(id==='twin')return t_('Inntekt ×{0}',dsep(twinK().toFixed(2)));return''}
/* what Phase 3 equipment is at a world point */
function p3Hit(wx,wy){const o=(id,x,y)=>({type:'p3',key:'p3:'+id,id,x,y});
 if(AUTO()&&B_('strang')){if(inR(wx,wy,(TD.x0+TD.x1)/2-30,TD.y0-58,60,18))return o('shtag',(TD.x0+TD.x1)/2,TD.y0-50);
  if(lv('insp')&&hyp(wx-1771,wy-946)<20)return o('grinder',1771,946);if(lv('insp')&&inR(wx,wy,ARCHX-8,TD.y0-20,16,TD.y1-TD.y0+40))return o('insp',ARCHX,TUR.y);
  if(lv('slagdet')&&hyp(wx-1386,wy-884)<16)return o('slagdet',1386,880);
  if(lv('tdheat')&&(inR(wx,wy,TD.x0,TD.y0+28,TD.x1-TD.x0,32)||inR(wx,wy,TD.x0,TD.y1-60,TD.x1-TD.x0,32)))return o('tdheat',(TD.x0+TD.x1)/2,TUR.y);
  for(let i=0;i<5;i++){const id=['tdheat','slagdet','ems','hss','insp'][i];if(lv(id)&&inR(wx,wy,QAX[i]-30,QAY-34,60,62))return o(id,QAX[i],QAY)}}
 if(elOn()){const E=ELG,y=E.y;if(Math.abs(wy-y)<46){if(wx>E.loop0-6&&wx<E.loop1+6)return o('el_loop',(E.loop0+E.loop1)/2,y);if(wx>=E.heat0&&wx<=E.heat1)return o('el_heat',(E.heat0+E.heat1)/2,y);
  if(wx>E.st0-16&&wx<E.st0+E.stN*E.stD)return o('el_stands',wx,y);if(wx>=E.q0&&wx<=E.q1)return o('el_quench',(E.q0+E.q1)/2,y);if(wx>E.q1&&wx<E.bund0)return o('el_shear',E.shear,y);if(wx>=E.bund0&&wx<=E.bund1)return o('el_bund',(E.bund0+E.bund1)/2,y)}}
 if(AUTO()){const B=BYPG;for(const[id,X]of[['slagmill',B.slag],['dheat',B.heat],['co2',B.co2]])if(lv(id)&&inR(wx,wy,X.x0,B.y0-30,X.x1-X.x0,B.y1-B.y0+30))return o(id,(X.x0+X.x1)/2,(B.y0+B.y1)/2)}
 if(lv('robot'))for(const c of[ROBG.bend,ROBG.weld])if(inR(wx,wy,c.x,c.y,c.w,c.h))return o('robot',c.x+c.w/2,c.y+c.h/2);
 if(AUTO()&&lv('sort')&&inR(wx,wy,SORTG.x0,SORTG.y-22,SORTG.x1-SORTG.x0,44))return o('sort',(SORTG.x0+SORTG.x1)/2,SORTG.y);
 if(AUTO()&&lv('twin')&&hyp(wx-TWINP.x,wy-TWINP.y)<28)return o('twin',TWINP.x,TWINP.y);
 return null}
const ixs=o=>o?(NO_()?o[0]:o[1]):'';
const ix4=o=>o?(NO_()?[o[0],o[1]]:[o[2],o[3]]):['',''];
const cap1=s=>s?s.charAt(0).toUpperCase()+s.slice(1):s;
const scase=s=>s?s.charAt(0)+s.slice(1).toLowerCase():s;
/* ---- what is at a world point: pads first (buying keeps priority over the bubble in pUp), then switches, rings and stores,
   ladles / torpedo cars / cranes, the two furnaces, plant equipment, and finally the station zone itself ---- */
const inR=(wx,wy,x,y,w,h)=>wx>=x&&wx<=x+w&&wy>=y&&wy<=y+h;
function hitInfo(wx,wy){
 for(const d of PADS){if(!(vis(d)||padMaks(d)))continue;const row=d.kind==='up'||d.kind==='hire',s=(d.kind==='build'?34:row?24:30)+4;
  let hit=Math.abs(wx-d.x)<=s&&Math.abs(wy-d.y)<=s;if(!hit&&row){const L=padLab(d);hit=inR(wx,wy,L.x,L.y,L.w,L.h)}
  if(hit)return{type:'pad',key:'pad:'+d.id,d,x:d.x,y:d.y}}
 for(const s of SW){if(s.on()&&Math.abs(wx-s.x)<=40&&Math.abs(wy-s.y)<=26)return{type:'sw',key:'sw:'+s.id,s,x:s.x,y:s.y}}
 {let best=null,bd=1;const cand=(type,id,o,x,y,r)=>{const d=hyp(wx-x,wy-y)/r;if(d<bd){bd=d;best={type,key:type+':'+id,o,x,y}}};
  cand('tap','tap',null,POS.tapPad.x,POS.tapPad.y,42);
  if(!rjClosed())cand('ring','skip',TGm.skip,TGm.skip.x,TGm.skip.y,46);
  for(const z of TG){if(z.id==='skip'||!z.open())continue;cand(z.id==='drop'?'drop':'ring',z.id,z,z.x,z.y,max(44,z.r))}
  for(const s of SRC){if(!s.open())continue;cand(s.pile?'pile':'src',s.id,s,s.x,s.y,s.r)}
  if(best)return best}
 /* the ladle car (and the ladle riding on it); under the ladle-furnace roof the furnace's own bubble comes first */
 const lcar={type:'lcar',key:'lcar',x:CAR.x,y:POS.tap.y},lfRoof=carOn()&&hyp(wx-POS.lf.x,wy-POS.lf.y)<44;
 if(carOn()&&!lfRoof&&inR(wx,wy,CAR.x-44,POS.tap.y-28,88,56))return lcar;
 for(const L of LADLES){if(hyp(wx-L.x,wy-L.y)<34)return{type:'ladle',key:'ladle:'+L.i,L,x:L.x,y:L.y}}
 if(lfRoof)return{type:'zone',key:'zone:lf',z:ZN.lf,x:POS.lf.x,y:POS.lf.y};
 if(carOn()&&inR(wx,wy,POS.rail.x0,POS.tap.y-30,POS.rail.x1-POS.rail.x0,60))return lcar;
 for(const t of TORPS){if(rjClosed()&&era()<7)continue;const onA=t.st==='go'||t.st==='pour'||(t.st==='fill'&&fillQ()[0]===t&&Math.abs(t.x-POS.torpX0)<3);
  if(era()>=8){const[x,y]=tlPt(t.x,onA);if(hyp(wx-x,wy-y)<46)return{type:'torp',key:'torp:'+t.i,t,x,y};continue}const y=onA?POS.torpA:POS.torpB;
  if(Math.abs(wx-t.x)<70&&Math.abs(wy-y)<26)return{type:'torp',key:'torp:'+t.i,t,x:t.x,y}}
 for(const c of CRANES){if(c.built()&&hyp(wx-c.x,wy-c.y)<30)return{type:'crane',key:'crane:'+c.id,c,x:c.x,y:c.y}}
 for(const h of helpers){if(!inCab(h)&&hyp(wx-h.x,wy-(h.y-14))<(h.agv?22:18))return{type:h.agv?'agv':'helper',key:(h.agv?'agv:':'helper:')+h.gi,h,x:h.x,y:h.y}}
 for(const d of ctlDesks()){if(inR(wx,wy,d.x-24,d.y-16,48,40))return{type:'misc',key:'misc:ctl_'+d.id,id:'ctl_'+d.id,d,x:d.x,y:d.y}}
 for(const u of MBK){if(!mbOn(u)||u==='rj')continue;const g2=mbGeo(u);if(g2&&inR(wx,wy,g2.z.x0,g2.z.y0+30,330,g2.z.y1-g2.z.y0-40))return{type:'mb',key:'mb:'+u,u,x:g2.cx,y:g2.cy}}
 if(AUTO()&&inR(wx,wy,CRB.x0,CRB.y0,CRB.x1-CRB.x0,CRB.y1-CRB.y0))return{type:'misc',key:'misc:cr',id:'cr',x:(CRB.x0+CRB.x1)/2,y:CRB.y0+40};
 {const p4=p4Hit(wx,wy);if(p4)return p4}{const p5=p5Hit(wx,wy);if(p5)return p5}
 if(CS()){const C=CSG,cs=(id,x,y)=>({type:'cs',key:'cs:'+id,id,x,y});
  if(hyp(wx-TROBP.x,wy-TROBP.y)<28||inR(wx,wy,882,686,30,76))return cs('robot',TROBP.x,TROBP.y);
  if(inR(wx,wy,POS.F.x-16,POS.F.y+84,32,SLAGP.y-SLAGP.h/2-POS.F.y-80))return cs('door',POS.F.x,POS.F.y+96);
  if(inR(wx,wy,C.xt,C.y-30,708-C.xt,60))return cs('car',C.xt+18,C.y);
  if(inR(wx,wy,C.xs,C.y-C.hw-30,C.xt-C.xs,26))return cs('inj',wx,C.y-C.hw-12);
  if(inR(wx,wy,C.xs,C.y-C.hw-4,C.xt-C.xs,2*C.hw+16))return cs('tunnel',wx,C.y);
  if(inR(wx,wy,C.xc,C.y-C.hw,C.xs-C.xc,2*C.hw+30))return cs('seal',(C.xc+C.xs)/2,C.y);
  if(inR(wx,wy,24,C.y-30,C.x0-24+6,60))return cs('conveyor',40,C.y);
  if(inR(wx,wy,C.x0,C.y-28,C.xc-C.x0,56))return cs('charge',wx,C.y);
  if(inR(wx,wy,C.dx-C.dw/2-8,140,C.dw+16,C.y-C.hw-140)||inR(wx,wy,364,150,90,120))return cs('duct',C.dx,wy);
  if(inR(wx,wy,60,40,300,200))return cs('filter',wx,wy)}
 {const p3=p3Hit(wx,wy);if(p3)return p3}
 if(inR(wx,wy,GAUGE.x-60,GAUGE.y-22,120,48)||(ET()==='hold'||ET()==='ind')&&inR(wx,wy,686,600,72,96)||(ET()==='sm'?inR(wx,wy,676,404,250,394):hyp(wx-POS.F.x,wy-POS.F.y)<112))return{type:'furnace',key:'furnace',x:POS.F.x,y:POS.F.y};
 if(!rjGone()&&Math.abs(wx-POS.rjF.x)<95&&wy>POS.rjF.y-260&&wy<POS.rjF.y+92)return{type:'rjf',key:'rjf',x:POS.rjF.x,y:POS.rjF.y};
 if(usesHM()&&hyp(wx-POS.hmL.x,wy-POS.hmL.y)<40)return{type:'misc',key:'misc:hmL',id:'hmL',x:POS.hmL.x,y:POS.hmL.y};
 for(const r in POSTS){const p=postOf(r);if((lv(HIRE[r].id)||AUTO()&&r!=='rj')&&stOn(r)&&inR(wx,wy,p.x-24,p.y-14,48,40))return{type:'misc',key:'misc:desk',id:AUTO()?'pult':'desk',r,x:p.x,y:p.y}}
 if(lv('operator')&&inR(wx,wy,TAPDESK.x-24,TAPDESK.y-40,48,66))return{type:'pad',key:'pad:u_operator',d:PAD.u_operator,x:TAPDESK.x,y:TAPDESK.y};
 /* plant equipment: supply plants and the råjernsverk machines explain their upgrade */
 const eq=[['kalk',928,68,112,56,()=>lv('kalk')],['o2',786,56,150,104,()=>lv('o2')],['kull',666,60,98,108,()=>lv('kull')],['koks',-716,130,160,110,()=>lv('koks')],
  ['cowper',-500,110,300,160,()=>!rjEra()],['rjsize',-480,180,240,70,()=>rjEra()],['malmkran',CRN.malm.x0,CRN.malm.y0-10,CRN.malm.x1-CRN.malm.x0,14,()=>lv('malmkran')]];
 for(const[id,x,y,w,h,on]of eq)if(on()&&inR(wx,wy,x,y,w,h))return{type:'up',key:'up:'+id,u:UPm[id],x:x+w/2,y:y+h/2};
 /* continuous caster machines */
 if(B_('strang')&&wx>1300&&wx<1764&&wy>630&&wy<1000){const c=(id,x,y)=>({type:'cast',key:'cast:'+id,id,x,y});
  if(hyp(wx-SHM.x,wy-SHM.y)<16)return c('shroud',SHM.x,SHM.y);if(hyp(wx-TUR.x,wy-TUR.y)<70&&wx<TD.x0-2)return c('turret',TUR.x,TUR.y);
  if(inR(wx,wy,TD.x0-8,TD.y0-36,TD.x1-TD.x0+16,TD.y1-TD.y0+50))return c('tundish',(TD.x0+TD.x1)/2,TUR.y);
  if(inR(wx,wy,TD.x1,TD.y0-8,MCX+14-TD.x1,TD.y1-TD.y0+16))return c('mould',MCX,TUR.y);
  if(inR(wx,wy,1486,TD.y0-10,54,TD.y1-TD.y0+20))return c('spray',1512,TUR.y);
  if(inR(wx,wy,WSX-2,TD.y0-8,30,TD.y1-TD.y0+16))return c('wsu',WSX+13,TUR.y);
  if(inR(wx,wy,1570,TD.y0-8,82,TD.y1-TD.y0+16))return c('cutter',CUTX(),TUR.y);
  if(inR(wx,wy,1652,668,110,326))return c('bed',1707,830)}
 if(!rjClosed()||PILE.pig.length){if(inR(wx,wy,-56,630,32,280))return{type:'misc',key:'misc:pigm',id:'pigm',x:-40,y:760}}
 if(!rjClosed()&&Math.abs(wy-POS.oreTrainY)<26&&wx>WXL0+10&&wx<-150)return{type:'misc',key:'misc:train',id:'train',x:wx,y:POS.oreTrainY};
 if(inR(wx,wy,POS.truck1.x-48,POS.truck1.y-110,96,260))return{type:'ring',key:'ring:bil1',o:TGm.bil1,x:POS.truck1.x,y:POS.truck1.y};
 if(B_('tog')&&Math.abs(wy-POS.railY)<30&&wx>ZN.utlast.x0)return{type:'ring',key:'ring:tog',o:TGm.tog,x:wx,y:POS.railY};
 if(B_('kai')&&wx>QX&&wy>QY)return{type:'ring',key:'ring:kai',o:TGm.kai,x:wx,y:wy};
 for(const z of ZONES){if(zoneShown(z)&&inZone(z,wx,wy))return{type:'zone',key:'zone:'+z.id,z,x:wx,y:wy}}
 return null}
/* ---- the bubble's content: title, 1–3 sentences, and a line of live numbers ---- */
function carNums(){const C=CAR,L=C.L,full=L&&L.steel>.05;
 const st=C.st==='tap'?(L&&L.state==='filling'?'Under tappen – fylles':L?'Under tappen – klar':'Under tappen'):C.st==='toLF'?'Kjører til øseovnen':C.st==='lf'?(L&&L.state==='lf'?'I øseovnen':'Venter på øsekranen'):C.st==='toStand'?'Kjører til øsestolen':C.st==='stand'?'Henter tom øse':'Kjører tom øse til tappen';
 return t_(st)+(full?' · '+tf(L.steel)+' t':'')+' · '+t_('{0} % i bruk',Math.round((C.busy||0)*100))}
function upNums(u){const l=lv(u.id),mx=l>=u.max,lvT=u.person?t_('Hjelpere {0} av {1}',l,u.max):t_('Nivå {0}/{1}',l,u.max);
 if(mx)return lvT+' · '+t_('MAKS');if(!upOpen(u))return lvT+' · '+t_('låst');const paid=S.paid['u:'+u.id]||0;return lvT+' · '+t_('neste: {0}',upSub(u))+' · '+kr(Math.ceil(upCost(u)-paid))}
function furnNums(){const E=E_(),st=status('ovn');return Math.round(F.temp)+' °C · '+tf(F.bath)+'/'+fcap()+' t'+(E.type==='conv'?' · '+tf(blowT())+' s':E.type==='hold'?'':' · '+Math.round(MW())+' '+t_(E.pu))+(st&&st.t?' · '+st.t:'')}
function infoFor(h){if(!h)return null;const sn=x=>t_(SUPN[x]);
 switch(h.type){
 case'pad':{const d=h.d;if(!d)return null;
  if(d.kind==='up'){const u=d.u;let n=upNums(u);if(['kalk','o2','kull'].indexOf(u.id)>=0&&lv(u.id))n+=' · '+t_('{0} av {1} t/min',tf(supCap(u.id)*60),tf(F.rp*60));if(['koks','cowper'].indexOf(u.id)>=0&&lv(u.id))n+=' · '+t_('{0} av {1} t/min',tf(rjSupCap(u.id)*60),tf(RJ.rp*60));
   return{t:upName(u),d:ixs(IX.up[u.id]),n}}
  if(d.kind==='hire'){const l=lv(d.h.id),N=d.h.costs.length,au=AUTO()&&IX.op[d.st];return{t:hName(d.h),d:au?ixs(IX.op[d.st]):ixs(IX.hire[d.st])+' '+ixs(IX.hire.all),n:t_(au?'Operatører {0} av {1}':'Hjelpere {0} av {1}',l,N)+(l<N?' · '+kr(cost(d)-(S.paid[paidKey(d)]||0)):'')}}
  if(d.kind==='build'){const b=nextBuild();if(!b)return null;const[,tx]=ix4(IX.misc.build);return{t:t_('Bygg: {0}',t_(b.n)),d:t_(b.d)+' '+tx,n:kr(b.cost)+' · '+t_('betalt {0}',kr(S.paid['b:'+b.id]||0))}}
  if(d.kind==='demol'||d.kind==='restart'){const M=MBU[d.u],dm=d.kind==='demol',[ti,tx]=ix4(IX.misc[dm?'dem':d.u==='dri'?(rebuildDRI(d)?'rebuilddri':'rstdri'):rebuildLD(d)?'rebuild':'rst']);return{t:ti+': '+mbName(d.u),d:tx,n:dm?kr(cost(d)-(S.paid[paidKey(d)]||0))+' · '+t_('+{0} t skrap',M.scrap)+' · '+t_('vedlikehold {0}',kr(M.up,'/min')):restartOK(d.u)?kr(cost(d)):t_('Låst · ingen ovn trenger den ennå')}}
  if(d.kind==='prestige'){const[ti,tx]=ix4(IX.misc.prestige);return{t:ti,d:tx,n:presGain()>0?t_('+{0} ekspertise',presGain()):t_('Tjen {0} totalt',kr(PRES_NEED))+' · '+kr(S.earned)}}return null}
 case'sw':{const s=h.s;return{t:t_(s.lab),d:ixs(IX.sw[s.id]),n:t_('Nå: {0}',swTxt(s.id).replace(/^[^:]*: /,''))}}
 case'tap':{const[ti,tx]=ix4(IX.ring.tap);return{t:ti,d:tx+(lv('operator')?' '+ixs(IX.up.operator):''),n:furnNums()}}
 case'drop':{const E=E_();return{t:cap1(t_(E.ch==='conv'?'skrapkassa':E.ch==='box'?'chargeringskassene':E.ch==='bucket'?'skrapkurv':'Chargeringsbånd')),d:ixs(IX.drop[E.ch]),n:t_('Fylt {0}/{1} t',tf(S.chg),tf(chgCap()))}}
 case'ring':{const z=h.o,[ti,tx]=ix4(IX.ring[z.id]);let n='';
  if(z.sell)n=t_('Pris ×{0}',L1(SELLM[z.sell]()))+(lv('pass')&&AUTO()?' · '+t_('CO₂ {0} t/t · grønn pris ×{1}',dsep(co2t().toFixed(2)),dsep(greenK().toFixed(2))):'')+(z.cash>=1?' · '+t_('{0} å hente',kr(z.cash)):'');
  else if(z.id==='skip')n=tf(S.rj.ore)+'/'+skipCap()+' t';else if(z.id==='rack')n=t_('{0} av {1} elektroder',Math.round(S.elek),12);
  else if(z.id==='plate')n=t_('Kokiller {0}/{1}',S.kok.slots+PIT.n,slotsMax())+(lv('kanal')?' · '+t_('kanalstein')+' '+(S.kanal|0):'')+(lv('hette')?' · '+t_('varmholdsmasse')+' '+(S.hette|0):'');
  else if(z.id==='koklag')n=t_('{0} klare · {1} kjøles',S.kok.ready,S.kok.cool.length);
  else if(NODE[{gjvIn:'gjv',nettIn:'nett',kobIn:'kob'}[z.id]]){const N=NODE[{gjvIn:'gjv',nettIn:'nett',kobIn:'kob'}[z.id]];n=t_('Kø {0}/{1}',N.in.length+N.inc,N.cap)}
  else if(z.id==='slagp')n=t_('Slaggpotte {0}/{1}',S.pot,potMax());
  return{t:ti,d:tx,n}}
 case'src':{const s=h.o;if(s.id==='koklag')return infoFor({type:'ring',o:TGm.koklag});if(s.id==='pot'&&CS())return infoFor({type:'cs',id:'pit'});const[ti,tx]=ix4(IX.ring[s.id]);let n='';
  if(s.yard)n=tf(yardT(s))+'/'+(s.id==='ore'?oreYardCap():yardCap())+' t';else if(s.store)n=t_('{0} på lager',ST[s.store]|0);else if(s.id==='kokv')n=t_('{0} varme',S.kok.hot);else if(s.id==='pot')n=S.pot+'/'+potMax()+(lv('slaggbil')?' · '+t_('Slaggbil'):'');
  return{t:ti,d:tx,n}}
 case'pile':{const k=h.o.pile,a=PILE[k],top=a.length?a[a.length-1]:{k,t:1,q:qLF()},pr=val(top)*BASEP()*gm()/max(.001,top.t);return{t:t_(PR[k].n),d:ixs(IX.kind[k]),n:a.length+' '+t_('stk')+' · '+kr(pr,'/t')+(lv('pass')&&AUTO()?' · '+t_('CO₂ {0} t/t · grønn pris ×{1}',dsep(co2t().toFixed(2)),dsep(greenK().toFixed(2))):'')}}
 case'lcar':{const[ti,tx]=ix4(IX.misc.lcar);return{t:ti,d:tx,n:carNums()}}
 case'ladle':{const L=h.L,[ti,tx]=ix4(IX.misc.ladle),stx={park:carOn()&&!onCar(L)?'på øsestolen':'venter',filling:'fylles',await:'venter på kranen',carried:'løftes',lf:'i øseovnen',pit:'blokkstøping',tur:'på øsetårnet',cast:'støper',car:'på øsevogna'}[L.state]||'';
  return{t:ti,d:tx,n:(L.steel>.05?tf(L.steel)+' t · ':'')+t_(stx)+(L.q>1.001?' · '+t_('Kvalitet ×{0}',L1(L.q)):'')}}
 case'torp':{const t=h.t,[ti,tx]=ix4(IX.misc[era()>=10?'pwag':era()>=8?'ltcar':era()===7?'torp7':'torp']);return{t:ti,d:tx,n:tf(t.load)+'/'+torpCap()+' t · '+t_(nTorp()===1?'{0} vogn':'{0} vogner',nTorp())}}
 case'crane':{const c=h.c,u={skrap:'kran',malm:'malmkran',ose:'osekran',mag:'magkran'}[c.id];if(c.id==='skrap'&&CS()){const[ti,tx]=ix4(IX.cs.crane);return{t:ti,d:tx,n:t_('Løft {0} t',tf(craneLift()))+' · '+upNums(UPm.kran)}}return{t:cap1(t_(c.n)),d:ixs(IX.crane[c.id]),n:upNums(UPm[u])}}
 case'cs':{const[ti,tx]=ix4(IX.cs[h.id]);const fd=t_('{0} t/min inn i ovnen',tf(CSB.feed*60));
  const n={charge:()=>t_('Fylt {0}/{1} t',tf(S.chg),tf(chgCap())),conveyor:()=>fd+' · '+upNums(UPm.charge),seal:()=>t_('Avgass ved uttaket: ca. {0} °C',Math.round(csGasT(CSG.xs+6))),
   tunnel:()=>t_('Skrapet inn i ovnen: {0} °C',Math.round(CSB.pre))+' · '+kwh()+' kWh/t',inj:()=>t_('Avgass ved ovnen: ca. {0} °C',Math.round(csGasT(CSG.xf))),duct:()=>t_('Avgass ved uttaket: ca. {0} °C',Math.round(csGasT(CSG.xs+6))),
   filter:()=>'',car:()=>fd,door:()=>t_('Slagg {0}/{1}',S.pot,potMax()),pit:()=>S.pot+'/'+potMax()+(lv('slaggbil')?' · '+t_('Slaggbil'):''),
   robot:()=>(TROB.n?t_('Siste måling: {0} °C',TROB.val)+' · '+t_('{0} målinger',TROB.n):t_('Venter på første måling'))}[h.id]();
  return{t:ti,d:tx,n}}
 case'helper':{const r=h.h.r,hi=HIRE[r];if(AUTO()&&IX.op[r])return{t:hName(hi),d:ixs(IX.op[r]),n:t_('Operatører {0} av {1}',lv(hi.id),hi.costs.length)};return{t:hName(hi),d:ixs(IX.hire[r])+' '+ixs(IX.hire.all),n:t_('Hjelpere {0} av {1}',lv(hi.id),hi.costs.length)}}
 case'agv':{const r=h.h.r,[ti,tx]=ix4(IX.misc.agv);return{t:ti,d:tx,n:t_('{0} vogner ved {1}',nAGV(r),t_(PR[AGVK[r]].n))+' · '+t_('last {0} stk',hcap())}}
 case'mb':{const u=h.u,M=MBU[u],[,tx]=ix4(IX.misc.mb),[,tr]=ix4(IX.misc.mbre);return{t:mbName(u)+' · '+M.yr,d:tx+(M.re?' '+tr:''),n:t_('LAGT NED')+' · '+t_('vedlikehold {0}',kr(M.up,'/min'))}}
 case'furnace':{const E=E_();return{t:(era()===7?t_('LD-konverter')+' · '+t_(E.n):era()>=8?t_(ET()==='ind'?'Induksjonsovn':'Holdeovn')+' · '+t_(E.n):t_(E.n))+' · '+E.yr,d:ixs(IX.era[era()]),n:furnNums()}}
 case'p5':{const[ti,tx]=ix4(IX.p5[h.id]);return{t:ti,d:tx,n:p5Nums(h.id)}}
 case'rjf':{if(rjClosed()){const[,tx]=ix4(IX.misc.closed),[,tm]=ix4(IX.misc.mb);return{t:t_(RJE[rjEra()].n),d:tx+' '+tm,n:t_('NEDLAGT')+(mbOn('rj')?' · '+t_('vedlikehold {0}',kr(MBU.rj.up,'/min')):'')}}const st=status('rj');return{t:t_(RJE[rjEra()].n)+' · '+RJE[rjEra()].yr,d:ixs(IX.rje[rjEra()]),n:t_('{0} t/min råjern',tf(RJ.rate*60))+' · '+t_('i ovnen {0} t',tf(S.rj.hearth))+(st&&st.lv?' · '+st.t:'')}}
 case'up':{const u=h.u;return infoFor({type:'pad',d:PAD['u_'+u.id]})}
 case'p4':{const[ti,tx]=ix4(IX.p4[h.id]);return{t:ti,d:tx,n:p4Nums(h.id)}}
 case'p3':{const id=h.id;if(IX.p3[id]){const[ti,tx]=ix4(IX.p3[id]);return{t:ti,d:tx,n:p3Nums(id)}}const u=UPm[id];if(!u)return null;return{t:upName(u),d:ixs(IX.up[id]),n:p3Nums(id)+' · '+upNums(u)}}
 case'cast':{const[ti,tx]=ix4(IX.cast[h.id]);const n={turret:()=>upNums(UPm.turret),shroud:()=>t_(CAST.pour?'Skjermrør på':'Skjermrør parkert'),tundish:()=>t_('Stålnivå {0} %',Math.round(CAST.tlev*100)),
   mould:()=>t_('{0} av {1} strenger i bruk',CAST.on?min(nStr(),CAST.nOn):nStr(),8)+' · '+upNums(UPm.strands),spray:()=>upNums(UPm.caster),
   wsu:()=>t_('Støpefart {0} m/min ({1} % av maks)',L1(castMpm()*(CAST.on?CAST.spd:0)),Math.round((CAST.on?CAST.spd:0)*100))+' · '+upNums(UPm.caster),cutter:()=>upNums(UPm.torch),bed:()=>t_('{0} emner på kjølesenga',CAST.bed.length)}[h.id]();
  return{t:ti,d:tx,n}}
 case'misc':{const[ti,tx]=ix4(IX.misc[h.id]);let n='',T2=ti;
  if(h.id==='hmL')n=t_('råjern {0} t',tf(S.hm))+' / '+Math.round(hmCap())+' t';
  else if(h.id==='pigm')n=PILE.pig.length+' '+t_('stk');
  else if(h.id==='train')n=tf(yardT(SRCm.ore))+'/'+oreYardCap()+' t';
  else if(h.id==='desk'||h.id==='pult'){const hi=HIRE[h.r];n=hName(hi)+' · '+t_(AUTO()?'Operatører {0} av {1}':'Hjelpere {0} av {1}',lv(hi.id),hi.costs.length)}
  else if(h.id==='cr')n=t_('{0} operatører',helpers.filter(o=>!o.agv&&(o.r==='ovn'||o.r==='strang')&&o.state==='post'&&!inCab(o)).length);
  else if(h.id&&h.id.startsWith('ctl_')){const d=h.d||{};n=(d.crane?G.crane===d.crane:G.ctl===d.id)?t_('Du styrer'):t_('Automatikk');if(h.id==='ctl_furnace')n+=' · '+furnNums()}
  return{t:T2,d:tx,n}}
 case'zone':{const z=h.z,built=zoneBuilt(z),nb=nextBuild();
  if(!built&&!(z.rj&&rjClosed())){const[ti,tx]=ix4(IX.misc.plot);const b=nb&&(ZN[nb.z]===z||(nb.id==='vv'&&(z.id==='gjv'||z.id==='vv'))||(nb.id==='stel'&&z.id==='salg2'))?nb:null;
   return{t:ti+(b?' · '+t_(b.n):''),d:b?tx.replace('{0}',t_(b.n))+' '+t_(b.d):ixs(IX.zone[z.id]),n:b?kr(b.cost):''}}
  if(z.mbp){const u=MBK.find(k=>mbOn(k)&&S.mb[k].p===z.id);if(u)return infoFor({type:'mb',u})}
  if(z.rj&&rjClosed()){const[,tx]=ix4(IX.misc.closed);return{t:scase(t_(z.n)),d:tx,n:t_('NEDLAGT')}}
  const st=status(z.id),t=z.id==='ovn'?scase(t_('STÅLVERK'))+' · '+t_(E_().n):z.id==='rj'?scase(t_('RÅJERNSVERK'))+' · '+t_(RJE[rjEra()].n):scase(t_(z.n));
  return{t,d:ixs(IX.zone[z.id]),n:st&&st.t?st.t:''}}}
 return null}
/* ---- the bubble element ---- */
const INFO={on:false,key:null,h:null,side:null,closedKey:null,closedT:-1e9,t:0};
function placeInfo(keep){const el=$('info'),h=INFO.h;if(!INFO.on||!h)return;
 const st=stage.getBoundingClientRect(),H=st.height,bh=el.offsetHeight||60;
 const topY=max(HUDM.top||70,8);let botLim=H-(HUDM.bot||50);
 const cb=$('craneBtn');if(cb&&!cb.hidden){const r=cb.getBoundingClientRect();if(r.height>0)botLim=min(botLim,r.top-st.top-8)}
 if(!keep||!INFO.side){const sy=ws(h.x,h.y)[1],cTop=topY+bh/2,cBot=botLim-bh/2;INFO.side=Math.abs(sy-cTop)>=Math.abs(sy-cBot)?'top':'bot'}
 if(INFO.side==='top'){el.style.top=topY+'px';el.style.bottom='';$('toast').style.bottom=''}
 else{el.style.top='';el.style.bottom=(H-botLim)+'px';$('toast').style.bottom=(H-botLim+bh+10)+'px'}}
function fillInfo(inf){$('infoT').textContent=inf.t||'';$('infoP').textContent=inf.d||'';$('infoN').textContent=inf.n||''}
function showInfo(h){const inf=infoFor(h);if(!inf||!inf.t&&!inf.d)return false;INFO.on=true;INFO.key=h.key;INFO.h=h;INFO.t=0;INFO.side=null;fillInfo(inf);$('info').classList.add('on');placeInfo(false);return true}
function hideInfo(){if(!INFO.on)return;INFO.on=false;INFO.h=null;$('info').classList.remove('on');$('toast').style.bottom=''}
function refreshInfo(){if(!INFO.on)return;const inf=infoFor(INFO.h);if(!inf){hideInfo();return}fillInfo(inf);placeInfo(true)}
/* a tap (short press, little movement) on the canvas: buying at a locked pad keeps priority, else explain what was tapped.
   The press that closed a bubble does not reopen the same one. */
function tapInfo(wx,wy,t0){if(G.mode!=='play'||G.modal||G.mapOn)return false;const h=hitInfo(wx,wy);if(!h)return false;
 if(h.key===INFO.closedKey&&Math.abs(t0-INFO.closedT)<120)return false;return showInfo(h)}
/* the next press anywhere (canvas, HUD, menu) closes the bubble; it still starts the joystick */
document.addEventListener('pointerdown',()=>{if(INFO.on){INFO.closedKey=INFO.key;INFO.closedT=performance.now();hideInfo()}else INFO.closedKey=null},true);

/* ---- Phase 5 explanations: [no title, no text, en title, en text] (equipment); up / op / hire / zone / era entries ---- */
Object.assign(IX.up,{
 cells:['Én elektrolysecelle til langs hallen. Hver celle har sin egen anode og tappes i den felles renna. Flere celler gir mer stål.','One more electrolysis cell along the hall. Each cell has its own anode and is tapped into the common launder. More cells make more steel.'],
 rect:['Kraftigere transformator og likeretter: mer strøm (kA) gjennom hver celle. Strømmen er det som splitter jernoksidet, så mer strøm gir mer stål.','A stronger transformer and rectifier: more current (kA) through every cell. The current is what splits the iron oxide, so more current makes more steel.'],
 anode:['En raskere anoderobot bytter slitte anoder på kortere tid, så hver celle står kortere stille.','A faster anode robot changes worn anodes in less time, so every cell stands still for less time.'],
 o2c:['Oksygenet fra anodene komprimeres og selges i rørledning. Hvert nivå gir mer betalt per tonn O₂.','The oxygen from the anodes is compressed and sold by pipeline. Each level earns more per tonne of O₂.'],
 ltc:['Større øser (eller platevogner) på overføringsvognene, og vognene kjører litt raskere.','Bigger ladles (or plate wagons) on the transfer cars, and the cars run a little faster.'],
 ltcn:['En vogn til på overføringslinja, så anlegget aldri står og venter på en tom vogn.','One more car on the transfer line, so the plant never waits for an empty car.'],
 indmw:['Kraftigere omformer og spole i induksjonsovnen: den smelter jernplatene raskere.','A stronger power converter and coil on the induction furnace: it melts the iron plates faster.'],
 pmw:['Mer effekt i plasmabrennerne: mer malmstøv reduseres og smeltes per minutt.','More power in the plasma torches: more ore fines are reduced and melted per minute.'],
 ptorch:['Én plasmabrenner til rundt den hule elektroden: mer effekt i reaktoren.','One more plasma torch around the hollow electrode: more power in the reactor.'],
 fines:['Mer malmstøv inn i siloen per minutt. Reaktoren trenger rundt 1,5 tonn malmstøv per tonn stål.','More ore fines into the silo per minute. The reactor needs about 1.5 tonnes of fines per tonne of steel.'],
 cond:['Dampkondensatoren gjør vanndampen fra reaktoren om til vann igjen og sender det tilbake til elektrolysørene. Mer vann tilbake gir mer hydrogen.','The steam condenser turns the reactor’s water vapour back into water and sends it to the electrolysers. More water back gives more hydrogen.'],
 tanks:['Ett elektrolysekar til i karhallen, med egne katodeplater.','One more electrolysis tank in the tank house, with its own cathode plates.'],
 ewcur:['Høyere strømtetthet: jernet vokser raskere på katodeplatene.','A higher current density: the iron grows faster on the cathode plates.'],
 harv:['Raskere høsterobot: løfter de ferdige jernplatene ut av karene og stabler dem for platevognene.','A faster harvest robot: lifts the finished iron plates out of the tanks and stacks them for the plate wagons.']});
Object.assign(IX.op,{moe:['Celleoperatører følger cellene fra pulten: strøm, temperatur og anodebytter. Hver operatør gir litt mer stål.','Cell operators watch the cells from the desk: current, temperature and anode changes. Each operator gives a little more steel.'],
 pls:['Plasmaoperatører kjører reaktoren fra pulten. Hver operatør gir litt mer stål.','Plasma operators run the reactor from the desk. Each operator gives a little more steel.'],
 ew:['Karoperatører følger karene og robotene fra pulten. Hver operatør gir litt flere plater.','Tank operators watch the tanks and the robots from the desk. Each operator gives a few more plates.']});
Object.assign(IX.hire,{moe:['Celleoperatører sitter ved pulten i cellehallen – her bærer ingen noe.','Cell operators sit at the desk in the cell hall – nobody carries anything here.'],
 pls:['Plasmaoperatører sitter ved pulten ved reaktoren – her bærer ingen noe.','Plasma operators sit at the desk by the reactor – nobody carries anything here.'],
 ew:['Karoperatører sitter ved pulten i karhallen – robotene høster platene.','Tank operators sit at the desk in the tank house – the robots harvest the plates.']});
Object.assign(IX.zone,{moe:['Smelteelektrolyse: malm løst i et smeltet oksidbad splittes av likestrøm til flytende stål og oksygen. Ingen kull, ingen hydrogen – bare strøm.','Molten oxide electrolysis: ore dissolved in a molten oxide bath is split by direct current into liquid steel and oxygen. No coal, no hydrogen – only electricity.'],
 pls:['Hydrogenplasma: malmstøv blåses inn i en lysbue av hydrogenplasma. Reduksjon og smelting skjer i samme kar; ut kommer flytende stål og vanndamp.','Hydrogen plasma: ore fines are blown into an arc of hydrogen plasma. Reduction and melting happen in the same vessel; out come liquid steel and water vapour.'],
 ew:['Kald elektrolyse: jernmalm løses i en lut ved rundt 110 °C, og strøm setter rent jern av som plater på katodene. Platene smeltes i induksjonsovnen.','Low-temperature electrowinning: iron ore is dissolved in a caustic bath at about 110 °C, and current deposits pure iron as plates on the cathodes. The plates are melted in the induction furnace.']});
IX.era[8]=['Smelteelektrolyse (rundt 2040): cellehallen lager flytende stål av malm og strøm. Overføringsvogner kjører stålet hit, og en induksjonsholdeovn samler det til en charge og tapper det i støpeøsene.','Molten oxide electrolysis (around 2040): the cell hall makes liquid steel from ore and electricity. Transfer cars bring the steel here, and an induction holding furnace collects it into a heat and taps it into the casting ladles.'];
IX.era[9]=['Hydrogenplasma (rundt 2045): plasmareaktoren gjør malmstøv om til flytende stål i ett trinn. Holdeovnen tar imot stålet og tapper det i støpeøsene.','Hydrogen plasma (around 2045): the plasma reactor turns ore fines into liquid steel in one step. The holding furnace takes the steel and taps it into the casting ladles.'];
IX.era[10]=['Kald elektrolyse (rundt 2050): jernplater fra karhallen smeltes i induksjonsovnen og tappes i støpeøsene. Ingen lysbue, ingen kull – bare strøm og rent jern.','Low-temperature electrowinning (around 2050): iron plates from the tank house are melted in the induction furnace and tapped into the casting ladles. No arc, no coal – only electricity and pure iron.'];
Object.assign(IX.misc,{ltcar:['Overføringsvogn','En selvgående vogn med en isolert øse. Den henter flytende stål ved anlegget og heller det i holdeovnen i stålverket.','Transfer car','A self-propelled car with an insulated ladle. It takes liquid steel at the plant and pours it into the holding furnace in the melt shop.'],
 pwag:['Platevogn','En flat vogn med stabler av jernplater fra karhallen. I stålverket tippes platene i induksjonsovnens platebinge.','Plate wagon','A flat wagon with stacks of iron plates from the tank house. At the melt shop the plates are tipped into the induction furnace’s plate bin.'],
 rstdri:['Start igjen','Plasmareaktoren trenger hydrogen: elektrolysørene og H₂-lageret i det gamle DRI-anlegget startes igjen. Sjaktovnen forblir kald.','Restart','The plasma reactor needs hydrogen: the electrolysers and the H₂ store of the old DRI plant are restarted. The shaft furnace stays cold.'],
 rebuilddri:['Bygg opp igjen','DRI-anlegget ble revet. Plasmareaktoren trenger hydrogen – her bygges elektrolysørene og lageret opp igjen.','Rebuild','The DRI plant was demolished. The plasma reactor needs hydrogen – the electrolysers and the store are rebuilt here.'],
 ctl_moe:['Cellepult','Herfra kjøres cellehallen. Trykk på pulten for å ta over: +10 % strøm i cellene. Går du fra pulten, tar automatikken over igjen.','Cell desk','The cell hall is run from here. Tap the desk to take over: +10 % current in the cells. Leave the desk and the automation takes over again.'],
 ctl_pls:['Plasmapult','Herfra kjøres plasmareaktoren. Trykk på pulten for å ta over: +10 % effekt. Går du fra pulten, tar automatikken over igjen.','Plasma desk','The plasma reactor is run from here. Tap the desk to take over: +10 % power. Leave the desk and the automation takes over again.'],
 ctl_ew:['Karpult','Herfra kjøres karhallen. Trykk på pulten for å ta over: +10 % strøm i karene. Går du fra pulten, tar automatikken over igjen.','Tank desk','The tank house is run from here. Tap the desk to take over: +10 % current in the tanks. Leave the desk and the automation takes over again.']});
Object.assign(IX.drop,{none:['Chargeringen hviler: stålet kommer flytende fra det nye anlegget, så her chargeres ikke noe skrap.','Charging is resting: the steel arrives liquid from the new plant, so no scrap is charged here.'],
 plate:['Chargeringen hviler: induksjonsovnen får jernplatene med platevogner, så her chargeres ikke noe skrap.','Charging is resting: the induction furnace gets its iron plates by plate wagon, so no scrap is charged here.']});
IX.p5={
 rect:['Likeretter','Transformatorer og en likeretter gjør vekselstrøm om til den kraftige likestrømmen cellene trenger. Strømskinner fører den langs hele hallen.','Rectifier','Transformers and a rectifier turn alternating current into the strong direct current the cells need. Busbars carry it along the whole hall.'],
 hall:['Cellehall','Celler på rad: i hver celle løses malm i et oksidbad på rundt 1600 °C. Likestrøm skiller ut flytende stål i bunnen og oksygen ved anoden.','Cell hall','Cells in a row: in each cell ore is dissolved in an oxide bath at about 1600 °C. Direct current separates liquid steel at the bottom and oxygen at the anode.'],
 launder:['Tapperenne','Cellene tappes fra bunnen i en oppvarmet renne som fører stålet til overføringsvogna.','Tapping launder','The cells are tapped from the bottom into a heated launder that leads the steel to the transfer car.'],
 robot:['Anoderobot','En portalkran kjører langs hallen og bytter slitte anoder automatisk. Cellen står stille mens anoden byttes.','Anode robot','A gantry runs along the hall and changes worn anodes automatically. The cell stands still while its anode is changed.'],
 o2:['Oksygen','Oksygenet fra anodene samles, komprimeres og selges i rørledning – et biprodukt som gir inntekt.','Oxygen','The oxygen from the anodes is collected, compressed and sold by pipeline – a by-product that earns money.'],
 silo:['Malmstøvsilo','Finmalt jernmalm. Den blåses pneumatisk inn i reaktoren.','Ore-fines silo','Finely ground iron ore. It is blown pneumatically into the reactor.'],
 reactor:['Plasmareaktor','Malmstøv faller gjennom en lysbue av hydrogenplasma fra den hule elektroden og brennerne. Hydrogenet tar oksygenet; flytende stål samles i bunnen.','Plasma reactor','Ore fines fall through an arc of hydrogen plasma from the hollow electrode and the torches. The hydrogen takes the oxygen; liquid steel collects at the bottom.'],
 cond:['Dampkondensator','Avgassen er vanndamp. Kondensatoren gjør den til vann igjen, og vannet går i rør tilbake til elektrolysørene – en sirkel.','Steam condenser','The off-gas is water vapour. The condenser turns it back into water, and the water is piped back to the electrolysers – a circle.'],
 pipes:['H₂ og vann','Hydrogen fra det gamle DRI-anleggets lager går ned til reaktoren; vann fra kondensatoren går tilbake opp til elektrolysørene.','H₂ and water','Hydrogen from the old DRI plant’s store goes down to the reactor; water from the condenser goes back up to the electrolysers.'],
 leach:['Lutkar','Finmalt jernmalm løses i en varm, sterk lut. Den rike luten pumpes til elektrolysekarene.','Dissolution tank','Finely ground iron ore is dissolved in a hot, strong caustic bath. The rich liquor is pumped to the electrolysis tanks.'],
 tankh:['Karhall','Rader med elektrolysekar. Strøm setter rent jern av som plater på katodene – omtrent som i en sinkfabrikk.','Tank house','Rows of electrolysis tanks. Current deposits pure iron as plates on the cathodes – much like a zinc refinery.'],
 harv:['Høsterobot','En portalrobot løfter ferdige jernplater opp av karene og setter dem på stableren.','Harvest robot','A gantry robot lifts finished iron plates out of the tanks and sets them on the stacker.'],
 stack:['Platestabler','Jernplatene stables her til platevognene henter dem.','Plate stacker','The iron plates are stacked here until the plate wagons take them.'],
 line:['Overføringslinje','To spor: fullt ut på det ene, tomt tilbake på det andre. Linja går opp langs anleggene og videre på de gamle torpedosporene til stålverket.','Transfer line','Two tracks: full out on one, empty back on the other. The line runs up past the plants and on along the old torpedo tracks to the melt shop.'],
 feed:['Innløp til ovnen','Overføringsvogna heller stålet i en renne inn i holdeovnen (eller tipper platene på en mater inn i induksjonsovnen).','Furnace inlet','The transfer car pours the steel into a launder into the holding furnace (or tips the plates onto a feeder into the induction furnace).']};
function p5Nums(id){switch(id){
 case'rect':return t_('{0} kA per celle',cellKA());case'hall':return status('moe')?status('moe').t:'';case'launder':return t_('{0} t i renna',tf(S.rj.hearth));
 case'robot':return t_('{0} % av tiden i drift',Math.round(anodeAv()*100));case'o2':return t_('{0} t/min O₂',tf(rate('f:moe>salg')))+' · '+kr(rate('v:moe'),'/min');
 case'silo':return t_('{0}/{1} t',tf(S.p5.fines),tf(finesCap()))+' · '+t_('{0} t/min inn',tf(finesRate()*60));case'reactor':return status('pls')?status('pls').t:'';
 case'cond':return t_('{0} % vann tilbake',Math.round(waterK()*100));case'pipes':return t_('{0} t/min H₂',tf(rate('f:h2>pls')));
 case'leach':case'tankh':return status('ew')?status('ew').t:'';case'harv':return t_('{0} t/min',tf(rate('harv')))+' · '+upNums(UPm.harv);case'stack':return t_('{0} t',tf(S.rj.hearth));
 case'line':return t_(nTorp()===1?'{0} vogn':'{0} vogner',nTorp())+' · '+torpCap()+' t';case'feed':return ET()==='ind'?t_('Platebinge {0}/{1} t',tf(S.hm),hmCap()):t_('{0} t/min inn',tf(rate('holdin')))}return''}
function p5Hit(wx,wy){const o=(id,x,y)=>({type:'p5',key:'p5:'+id,id,x,y}),g5=P5G;
 if(era()>=8&&(ET()==='hold'||ET()==='ind')&&inR(wx,wy,686,610,64,84))return o('feed',716,650);
 if(B_('moe')&&mbSt('moe')!=='gone'&&!mbOn('moe')){const m=g5.moe;if(inR(wx,wy,m.yx0,m.hy0,m.yx1-m.yx0,m.hy1-m.hy0))return o('rect',(m.yx0+m.yx1)/2,(m.hy0+m.hy1)/2);
  if(Math.abs(wy-m.tapY)<12&&wx>m.hx0&&wx<g5.A)return o('launder',wx,m.tapY);if(era()===8&&Math.abs(wx-P5.an.x)<16&&wy>m.hy0&&wy<m.hy1)return o('robot',P5.an.x,(m.cy0+m.cy1)/2);
  if(inR(wx,wy,m.hx0,m.hy0,m.hx1-m.hx0,m.hy1-m.hy0))return o('hall',(m.hx0+m.hx1)/2,(m.hy0+m.hy1)/2);if(hyp(wx-m.o2.x,wy-m.o2.y)<m.o2.r+6||inR(wx,wy,-940,1276,46,40))return o('o2',m.o2.x,m.o2.y)}
 if(B_('pls')&&mbSt('pls')!=='gone'&&!mbOn('pls')){const q=g5.pls;if(hyp(wx-q.silo.x,wy-q.silo.y)<q.silo.r+8)return o('silo',q.silo.x,q.silo.y);if(hyp(wx-q.R.x,wy-q.R.y)<q.R.r+8)return o('reactor',q.R.x,q.R.y);
  if(inR(wx,wy,q.cond.x0,q.cond.y0-30,q.cond.x1-q.cond.x0,q.cond.y1-q.cond.y0+30))return o('cond',(q.cond.x0+q.cond.x1)/2,(q.cond.y0+q.cond.y1)/2);if(Math.abs(wx+1603)<10&&wy>270&&wy<1650)return o('pipes',-1603,wy)}
 if(B_('ew')){const w=g5.ew;if(hyp(wx-w.leach.x,wy-w.leach.y)<w.leach.r+8)return o('leach',w.leach.x,w.leach.y);if(inR(wx,wy,w.rect.x0,w.rect.y0,w.rect.x1-w.rect.x0,w.rect.y1-w.rect.y0))return o('rect',(w.rect.x0+w.rect.x1)/2,(w.rect.y0+w.rect.y1)/2);
  if(inR(wx,wy,w.stack.x-25,w.stack.y-30,50,60))return o('stack',w.stack.x,w.stack.y);if(era()===10){const gy=w.hy0+16+P5.hv.row*76+29;if(Math.abs(wy-gy)<14&&wx>w.hx0&&wx<w.hx1)return o('harv',wx,gy)}
  if(inR(wx,wy,w.hx0,w.hy0,w.hx1-w.hx0,w.hy1-w.hy0))return o('tankh',(w.hx0+w.hx1)/2,(w.hy0+w.hy1)/2)}
 if(era()>=8&&(Math.abs(wx-g5.A-14)<30&&wy>692&&wy<TL.yF+20||Math.abs(wy-707)<30&&wx>g5.A&&wx<680))return o('line',wx,wy);
 for(const u of['esf','dri','moe','pls'])if(mbOn(u)&&inZone(ZN[MBU[u].own],wx,wy,0)){const c=ownC(u);return{type:'mb',key:'mb:'+u,u,x:c.cx,y:c.cy}}
 return null}
