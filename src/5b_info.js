
/* ---------- tap-to-explain: a short tap on anything in the plant opens an explanation bubble ----------
   texts are [Norwegian, English]; titles reuse the game's names where they exist. */
const IX={
 up:{
  carry:['Du bærer flere ting om gangen, så hver tur flytter mer.','You carry more items at a time, so every trip moves more.'],
  speed:['Du går raskere mellom stasjonene.','You walk faster between the stations.'],
  yard:['Flere skrapleveranser til skraphaugen: den fylles raskere og rommer mer.','More scrap deliveries to the scrap pile: it refills faster and holds more.'],
  kran:['En traverskran med løftemagnet flytter skrap fra haugen til chargeringen av seg selv. Hvert nivå løfter mer og kjører raskere.','An overhead crane with a lifting magnet moves scrap from the pile to the charging area by itself. Each level lifts more and moves faster.'],
  charge:['Mer plass til skrap ved ovnen: større skrapkasse (konverter), flere chargeringskasser (SM-ovn), større skrapkurv (lysbueovn) eller raskere Consteel-bånd.','More room for scrap at the furnace: a bigger scrap box (converter), more charging boxes (open hearth), a bigger scrap bucket (arc furnace) or a faster Consteel belt.'],
  magnet:['Større løftemagnet på chargeringskranen (Consteel): hvert nivå løfter mer skrap per tur.','A bigger lifting magnet on the charging crane (Consteel): each level lifts more scrap per trip.'],
  yard2:['En skraphaug til, med egne leveranser – dobbelt så mye skrap å hente fra.','A second scrap pile with its own deliveries – twice as much scrap to pick from.'],
  forvarm:['Skrapkurven forvarmes med varm avgass før chargering. Varmt skrap smelter med mindre strøm.','The scrap bucket is preheated with hot off-gas before charging. Warm scrap melts with less electricity.'],
  furnace:['Større ovn eller konverter: mer stål per charge. Den trenger også mer skrap, råjern og forsyning.','A bigger furnace or converter: more steel per heat. It also needs more scrap, hot metal and supplies.'],
  power:['Raskere smelting eller blåsing: sterkere blåsemaskin (Bessemer), sterkere brennere (SM-ovn), kraftigere O₂-lanse (LD) eller mer transformatoreffekt (lysbueovn).','Faster melting or blowing: a stronger blowing engine (Bessemer), stronger burners (open hearth), a stronger O₂ lance (LD) or more transformer power (arc furnace).'],
  refine:['Kortere tid fra smeltet bad til stål som er klart til tapping: prøvetaking, temperatur og analyse går raskere.','Less time from a melted bath to steel that is ready to tap: sampling, temperature and analysis go faster.'],
  operator:['En tapper ved pulten ved TAPP. Han tapper hver charge for deg, så du slipper å gå dit.','A furnace tapper at the desk next to TAP. He taps every heat for you, so you don’t have to walk there.'],
  ladle:['En øse til i omløp. Mens én øse støpes eller behandles, kan neste stå klar under tappen.','One more ladle in circulation. While one ladle is casting or being treated, the next can wait under the tap.'],
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
  lft:['Kortere behandlingstid i øseovnen.','Shorter treatment time in the ladle furnace.'],
  osekran:['En raskere øsekran flytter øsene mellom tappen, øseovnen og støpingen.','A faster ladle crane moves the ladles between the tap, the ladle furnace and casting.'],
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
  tcup:['Tempcore bråkjøler overflaten av stangen med vann rett etter siste valsepar. Mer kapasitet = flere stenger.','Tempcore quenches the surface of the bar with water right after the last stand. More capacity = more bars.'],
  stelup:['Raskere ferdigblokk i valstrådlinja.','A faster finishing block on the wire-rod line.'],
  stelmor:['Stelmor-vifter kjøler valstrådringene kontrollert på transportøren, så strukturen blir riktig.','Stelmor fans cool the wire-rod rings in a controlled way on the conveyor, so the steel gets the right structure.'],
  ktrans:['Kveiletransport fra valstrådlinja til nettverket, så kveilene går dit av seg selv.','A coil conveyor from the wire-rod line to mesh welding, so the coils go there by themselves.'],
  nettup:['Raskere sveisemaskin: mer valstråd blir til armeringsnett.','A faster welding machine: more wire rod becomes rebar mesh.'],
  kobup:['Raskere bøyemaskiner i klipp og bøy.','Faster bending machines at cut & bend.'],
  togp:['Bedre togavtale: toget betaler mer per tonn.','A better rail contract: the train pays more per tonne.'],
  kaip:['Bedre kaiavtale: skipet betaler mer per tonn.','A better shipping contract: the ship pays more per tonne.']},
 hire:{
  rj:['Malmhjelpere bærer malm fra malmlageret til skipet, og masseljern til salg.','Ore helpers carry ore from the ore yard to the skip, and pig iron to sale.'],
  skrap:['Skraphjelpere bærer skrap fra haugen til chargeringen.','Scrap helpers carry scrap from the pile to the charging area.'],
  ovn:['Ovnshjelpere tømmer slaggpotta og fyller elektrodestativet.','Furnace helpers empty the slag pot and refill the electrode rack.'],
  blokk:['Blokkhjelpere setter kokiller på bunnplata, bærer kanalstein, varmholdsmasse og varme kokiller, og selger støpeblokkene.','Ingot helpers set moulds on the bottom plate, carry runner bricks, hot-top compound and hot moulds, and sell the ingots.'],
  strang:['Emnehjelpere bærer emner fra kjølesenga til gjennomvarmingen eller til salg.','Billet helpers carry billets from the cooling bed to reheating or to sale.'],
  vv:['Valseverkshjelpere bærer armeringsstål til klipp og bøy eller til salg.','Rolling-mill helpers carry rebar to cut & bend or to sale.'],
  tc:['Tempcorehjelpere bærer Tempcore-armering videre eller til salg.','Tempcore helpers carry Tempcore rebar onward or to sale.'],
  stel:['Valstrådhjelpere bærer kveiler til nettverket eller til salg.','Wire-rod helpers carry coils to mesh welding or to sale.'],
  nett:['Netthjelpere bærer armeringsnettene til salg.','Mesh helpers take the rebar mesh to sale.'],
  kob:['Bøyehjelpere bærer den bøyde armeringen til salg.','Bending helpers take the bent rebar to sale.'],
  all:['Når en kran eller rullebane gjør jobben, venter de ved operatørpulten.','When a crane or conveyor covers the job, they wait at the operator desk.']},
 zone:{
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
  tc:['Tempcore: vannkjøling gir hard overflate og seig kjerne – sterk B500-armering uten dyre legeringer.','Tempcore: water quenching gives a hard skin and a tough core – strong B500 rebar without costly alloys.'],
  stel:['Valstrådlinja: ferdigblokk, leggehode og Stelmor-transportør lager kveiler av tynn tråd.','The wire-rod line: finishing block, laying head and Stelmor conveyor make coils of thin rod.'],
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
  tcore:['Tempcore-armering: herdet overflate og seig kjerne – sterk og sveisbar.','Tempcore rebar: a quenched skin and a tough core – strong and weldable.'],
  coil:['Valstråd: tynn tråd i store ringer, til nett, spiker og trådprodukter.','Wire rod: thin rod in big coils, for mesh, nails and wire products.'],
  mesh:['Armeringsnett: sveisede rutenett til gulv og vegger i betong.','Rebar mesh: welded grids for concrete floors and walls.'],
  bent:['Bøyd armering: kappet og bøyd etter tegning, klar til å legges i forskalingen.','Bent rebar: cut and bent to the drawing, ready to place in the formwork.']},
 era:[
  ['Bessemer-konverteren (oppfunnet 1856) blåser luft gjennom flytende råjern. Forbrenningen av karbon og silisium gir all varmen – ingen brensel. Her: råjern og litt kjøleskrap inn, blås, og tipp for tapping.','The Bessemer converter (invented 1856) blows air through liquid hot metal. Burning off carbon and silicon gives all the heat – no fuel. Here: hot metal and a little cooling scrap go in, it blows, then tilts to tap.'],
  ['Siemens-Martin-ovnen (1860-årene) fyres med forvarmet gass og luft og kan smelte mye skrap; en charge tar timer. Her: skrap og råjern i kasser, og den trenger kalk.','The open-hearth (Siemens-Martin) furnace (1860s) is fired with preheated gas and air and can melt plenty of scrap; a heat takes hours. Here: scrap and hot metal in boxes, and it needs lime.'],
  ['LD-konverteren (1952) blåser rent oksygen ovenfra gjennom en lanse. Rundt 40 minutter per charge, 75–85 % råjern og resten skrap. Trenger kalk og oksygen.','The LD (BOF) converter (1952) blows pure oxygen from above through a lance. About 40 minutes per heat, 75–85% hot metal and the rest scrap. Needs lime and oxygen.'],
  ['Lysbueovnen smelter skrap med lysbuer fra tre grafittelektroder – uten råjern. Her: skrapkurv, strøm, kalk og oksygen.','The electric arc furnace melts scrap with arcs from three graphite electrodes – no hot metal needed. Here: scrap bucket, power, lime and oxygen.'],
  ['UHP-lysbueovnen (ultrahøy effekt) har vannkjølte paneler, stor transformator, oksygenlanser og kullinjeksjon for skumslagg. Under en time fra tapping til tapping.','The UHP (ultra-high power) arc furnace has water-cooled panels, a big transformer, oxygen lances and coal injection for foaming slag. Under an hour from tap to tap.'],
  ['Consteel: skrapet mates kontinuerlig gjennom en forvarmingstunnel rett i et flatt bad. Rundt 45 % av stålet blir igjen i ovnen (varm rest), så skrapet smelter ved å synke i flytende stål. Taket er lukket, lysbuen er dekket av skumslagg, og den varme resten gjør drifta jevn med lite flimmer. Tappes gjennom bunnen (EBT).','Consteel: scrap is fed continuously through a preheating tunnel straight into a flat bath. About 45% of the steel stays in the furnace (the hot heel), so the scrap melts by sinking into liquid steel. The roof stays closed, the arc is buried in foaming slag, and the hot heel keeps the running steady with little flicker. Tapped through the bottom (EBT).']],
 rje:[
  ['Masovnen: malm, koks og kalk chargeres på toppen, og varm blåst blåses inn nederst. Koksen brenner og reduserer malmen til flytende råjern med rundt 4 % karbon.','The blast furnace: ore, coke and limestone go in at the top, hot blast is blown in at the bottom. The coke burns and reduces the ore to liquid hot metal with about 4% carbon.'],
  ['Elektrisk råjernsovn: tre Söderberg-elektroder gir varmen, og koksen er bare reduksjonsmiddel. Ingen cowpere – mer effekt (MVA) gir mer råjern.','Electric pig-iron furnace: three Söderberg electrodes supply the heat and the coke is only the reducing agent. No hot stoves – more power (MVA) gives more iron.']],
 drop:{
  conv:['Skrapkasse: skrap til konverteren. Bessemer tar bare litt kjøleskrap; LD tar rundt en femtedel skrap.','Scrap box: scrap for the converter. Bessemer only takes a little cooling scrap; LD takes about one fifth scrap.'],
  box:['Chargeringskasser: skrapet lastes i kasser som chargeringsmaskinen tømmer inn gjennom ovnsdørene.','Charging boxes: scrap is loaded into boxes that the charging machine tips in through the furnace doors.'],
  bucket:['Skrapkurv: kranen løfter kurven over ovnen, taket svinges til side og skrapet slippes ned.','Scrap bucket: the crane lifts the bucket over the furnace, the roof swings aside and the scrap drops in.'],
  belt:['Sjakt ned på chargeringsseksjonen: skrap som bæres hit, havner på Consteel-transportøren. Chargeringskranen gjør jobben av seg selv.','A chute onto the charging section: scrap carried here ends up on the Consteel conveyor. The charging crane does this job by itself.']},
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
  torp:['Torpedovogn','Isolert jernbanevogn som frakter rundt 1450 °C varmt råjern fra masovnen til stålverket.','Torpedo car','An insulated rail car that carries hot metal at about 1450 °C from the blast furnace to the melt shop.'],
  ladle:['Støpeøse','Stålkappe med ildfast foring. Den tar imot stålet fra ovnen, og kranen bærer den til øseovnen og støpingen.','Ladle','A steel shell with a refractory lining. It takes the steel from the furnace, and the crane carries it to the ladle furnace and to casting.'],
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
  wsu:['Uttrekk og retting','Drevne valsepar trekker strengen ut av kokilla med støpefarten og retter den ut fra buen til et rett emne.','Withdrawal and straightening','Driven roll pairs pull the strand out of the mould at casting speed and straighten it from the arc into a straight bar.'],
  cutter:['Kapping','Strengen kappes i emnelengder mens den går. En hydraulisk saks klipper den; en skjærebrenner kjører med strengen og brenner den av med mindre tap av stål.','Cutting','The moving strand is cut into billet lengths. A hydraulic shear chops it; a cutting torch travels with the strand and burns through with less steel lost.'],
  bed:['Kjøleseng','Hakkede bjelker flytter emnene steg for steg over senga mens de kjøles fra rødglødende til grå. Herfra går de til gjennomvarming eller salg.','Cooling bed','Notched beams walk the billets step by step across the bed while they cool from red-hot to grey. From here they go to reheating or to sale.']},
 /* the Consteel line: [Norwegian title, Norwegian text, English title, English text] */
 cs:{
  charge:['Chargeringsseksjon','Den åpne delen av Consteel-transportøren, langs skrapplassen. Magnetkranen legger skrapet i jevne løft over hele lengden, og laget kryper videre mot tunnelen.','Charging section','The open part of the Consteel conveyor, alongside the scrap yard. The magnet crane lays the scrap in even lifts over its whole length, and the layer creeps on toward the tunnel.'],
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
 for(const L of LADLES){if(hyp(wx-L.x,wy-L.y)<34)return{type:'ladle',key:'ladle:'+L.i,L,x:L.x,y:L.y}}
 for(const t of TORPS){if(rjClosed()&&t.i>0)continue;const onA=t.st==='go'||t.st==='pour'||(t.st==='fill'&&fillQ()[0]===t&&Math.abs(t.x-POS.torpX0)<3),y=onA?POS.torpA:POS.torpB;
  if(Math.abs(wx-t.x)<70&&Math.abs(wy-y)<26)return{type:'torp',key:'torp:'+t.i,t,x:t.x,y}}
 for(const c of CRANES){if(c.built()&&hyp(wx-c.x,wy-c.y)<30)return{type:'crane',key:'crane:'+c.id,c,x:c.x,y:c.y}}
 for(const h of helpers){if(!inCab(h)&&hyp(wx-h.x,wy-(h.y-14))<18)return{type:'helper',key:'helper:'+h.gi,h,x:h.x,y:h.y}}
 if(era()===5){const C=CSG,cs=(id,x,y)=>({type:'cs',key:'cs:'+id,id,x,y});
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
 if(inR(wx,wy,GAUGE.x-60,GAUGE.y-22,120,48)||(ET()==='sm'?inR(wx,wy,676,404,250,394):hyp(wx-POS.F.x,wy-POS.F.y)<112))return{type:'furnace',key:'furnace',x:POS.F.x,y:POS.F.y};
 if(Math.abs(wx-POS.rjF.x)<95&&wy>POS.rjF.y-260&&wy<POS.rjF.y+92)return{type:'rjf',key:'rjf',x:POS.rjF.x,y:POS.rjF.y};
 if(usesHM()&&hyp(wx-POS.hmL.x,wy-POS.hmL.y)<40)return{type:'misc',key:'misc:hmL',id:'hmL',x:POS.hmL.x,y:POS.hmL.y};
 for(const r in POSTS){const p=POSTS[r];if(lv(HIRE[r].id)&&stOn(r)&&inR(wx,wy,p.x-24,p.y-14,48,40))return{type:'misc',key:'misc:desk',id:'desk',r,x:p.x,y:p.y}}
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
 if(!rjClosed()&&Math.abs(wy-POS.oreTrainY)<26&&wx>WX0+10&&wx<-150)return{type:'misc',key:'misc:train',id:'train',x:wx,y:POS.oreTrainY};
 if(inR(wx,wy,POS.truck1.x-48,POS.truck1.y-110,96,260))return{type:'ring',key:'ring:bil1',o:TGm.bil1,x:POS.truck1.x,y:POS.truck1.y};
 if(B_('tog')&&Math.abs(wy-POS.railY)<30&&wx>ZN.utlast.x0)return{type:'ring',key:'ring:tog',o:TGm.tog,x:wx,y:POS.railY};
 if(B_('kai')&&wx>QX&&wy>QY)return{type:'ring',key:'ring:kai',o:TGm.kai,x:wx,y:wy};
 for(const z of ZONES){if(zoneShown(z)&&inZone(z,wx,wy))return{type:'zone',key:'zone:'+z.id,z,x:wx,y:wy}}
 return null}
/* ---- the bubble's content: title, 1–3 sentences, and a line of live numbers ---- */
function upNums(u){const l=lv(u.id),mx=l>=u.max,lvT=u.person?t_('Hjelpere {0} av {1}',l,u.max):t_('Nivå {0}/{1}',l,u.max);
 if(mx)return lvT+' · '+t_('MAKS');if(!upOpen(u))return lvT+' · '+t_('låst');const paid=S.paid['u:'+u.id]||0;return lvT+' · '+t_('neste: {0}',upSub(u))+' · '+kr(Math.ceil(upCost(u)-paid))}
function furnNums(){const E=E_(),st=status('ovn');return Math.round(F.temp)+' °C · '+tf(F.bath)+'/'+fcap()+' t'+(E.type==='conv'?' · '+tf(blowT())+' s':' · '+Math.round(MW())+' '+t_(E.pu))+(st&&st.t?' · '+st.t:'')}
function infoFor(h){if(!h)return null;const sn=x=>t_(SUPN[x]);
 switch(h.type){
 case'pad':{const d=h.d;if(!d)return null;
  if(d.kind==='up'){const u=d.u;let n=upNums(u);if(['kalk','o2','kull'].indexOf(u.id)>=0&&lv(u.id))n+=' · '+t_('{0} av {1} t/min',tf(supCap(u.id)*60),tf(F.rp*60));if(['koks','cowper'].indexOf(u.id)>=0&&lv(u.id))n+=' · '+t_('{0} av {1} t/min',tf(rjSupCap(u.id)*60),tf(RJ.rp*60));
   return{t:upName(u),d:ixs(IX.up[u.id]),n}}
  if(d.kind==='hire'){const l=lv(d.h.id),N=d.h.costs.length;return{t:hName(d.h),d:ixs(IX.hire[d.st])+' '+ixs(IX.hire.all),n:t_('Hjelpere {0} av {1}',l,N)+(l<N?' · '+kr(cost(d)-(S.paid[paidKey(d)]||0)):'')}}
  if(d.kind==='build'){const b=nextBuild();if(!b)return null;const[,tx]=ix4(IX.misc.build);return{t:t_('Bygg: {0}',t_(b.n)),d:t_(b.d)+' '+tx,n:kr(b.cost)+' · '+t_('betalt {0}',kr(S.paid['b:'+b.id]||0))}}
  if(d.kind==='prestige'){const[ti,tx]=ix4(IX.misc.prestige);return{t:ti,d:tx,n:presGain()>0?t_('+{0} ekspertise',presGain()):t_('Tjen {0} totalt',kr(PRES_NEED))+' · '+kr(S.earned)}}return null}
 case'sw':{const s=h.s;return{t:t_(s.lab),d:ixs(IX.sw[s.id]),n:t_('Nå: {0}',swTxt(s.id).replace(/^[^:]*: /,''))}}
 case'tap':{const[ti,tx]=ix4(IX.ring.tap);return{t:ti,d:tx+(lv('operator')?' '+ixs(IX.up.operator):''),n:furnNums()}}
 case'drop':{const E=E_();return{t:cap1(t_(E.ch==='conv'?'skrapkassa':E.ch==='box'?'chargeringskassene':E.ch==='bucket'?'skrapkurv':'Consteel-bånd')),d:ixs(IX.drop[E.ch]),n:t_('Fylt {0}/{1} t',tf(S.chg),tf(chgCap()))}}
 case'ring':{const z=h.o,[ti,tx]=ix4(IX.ring[z.id]);let n='';
  if(z.sell)n=t_('Pris ×{0}',L1(SELLM[z.sell]()))+(z.cash>=1?' · '+t_('{0} å hente',kr(z.cash)):'');
  else if(z.id==='skip')n=tf(S.rj.ore)+'/'+skipCap()+' t';else if(z.id==='rack')n=t_('{0} av {1} elektroder',Math.round(S.elek),12);
  else if(z.id==='plate')n=t_('Kokiller {0}/{1}',S.kok.slots+PIT.n,slotsMax())+(lv('kanal')?' · '+t_('kanalstein')+' '+(S.kanal|0):'')+(lv('hette')?' · '+t_('varmholdsmasse')+' '+(S.hette|0):'');
  else if(z.id==='koklag')n=t_('{0} klare · {1} kjøles',S.kok.ready,S.kok.cool.length);
  else if(NODE[{gjvIn:'gjv',nettIn:'nett',kobIn:'kob'}[z.id]]){const N=NODE[{gjvIn:'gjv',nettIn:'nett',kobIn:'kob'}[z.id]];n=t_('Kø {0}/{1}',N.in.length+N.inc,N.cap)}
  else if(z.id==='slagp')n=t_('Slaggpotte {0}/{1}',S.pot,potMax());
  return{t:ti,d:tx,n}}
 case'src':{const s=h.o;if(s.id==='koklag')return infoFor({type:'ring',o:TGm.koklag});if(s.id==='pot'&&era()===5)return infoFor({type:'cs',id:'pit'});const[ti,tx]=ix4(IX.ring[s.id]);let n='';
  if(s.yard)n=tf(yardT(s))+'/'+(s.id==='ore'?oreYardCap():yardCap())+' t';else if(s.store)n=t_('{0} på lager',ST[s.store]|0);else if(s.id==='kokv')n=t_('{0} varme',S.kok.hot);else if(s.id==='pot')n=S.pot+'/'+potMax()+(lv('slaggbil')?' · '+t_('Slaggbil'):'');
  return{t:ti,d:tx,n}}
 case'pile':{const k=h.o.pile,a=PILE[k],top=a.length?a[a.length-1]:{k,t:1,q:qLF()},pr=val(top)*BASEP()*gm()/max(.001,top.t);return{t:t_(PR[k].n),d:ixs(IX.kind[k]),n:a.length+' '+t_('stk')+' · '+kr(pr,'/t')}}
 case'ladle':{const L=h.L,[ti,tx]=ix4(IX.misc.ladle),stx={park:'venter',filling:'fylles',await:'venter på kranen',carried:'løftes',lf:'i øseovnen',pit:'blokkstøping',tur:'på øsetårnet',cast:'støper'}[L.state]||'';
  return{t:ti,d:tx,n:(L.steel>.05?tf(L.steel)+' t · ':'')+t_(stx)+(L.q>1.001?' · '+t_('Kvalitet ×{0}',L1(L.q)):'')}}
 case'torp':{const t=h.t,[ti,tx]=ix4(IX.misc.torp);return{t:ti,d:tx,n:tf(t.load)+'/'+torpCap()+' t · '+t_(nTorp()===1?'{0} vogn':'{0} vogner',nTorp())}}
 case'crane':{const c=h.c,u={skrap:'kran',malm:'malmkran',ose:'osekran',mag:'magkran'}[c.id];if(c.id==='skrap'&&era()===5){const[ti,tx]=ix4(IX.cs.crane);return{t:ti,d:tx,n:t_('Løft {0} t',tf(craneLift()))+' · '+upNums(UPm.kran)}}return{t:cap1(t_(c.n)),d:ixs(IX.crane[c.id]),n:upNums(UPm[u])}}
 case'cs':{const[ti,tx]=ix4(IX.cs[h.id]);const fd=t_('{0} t/min inn i ovnen',tf(CSB.feed*60));
  const n={charge:()=>t_('Fylt {0}/{1} t',tf(S.chg),tf(chgCap())),conveyor:()=>fd+' · '+upNums(UPm.charge),seal:()=>t_('Avgass ved uttaket: ca. {0} °C',Math.round(csGasT(CSG.xs+6))),
   tunnel:()=>t_('Skrapet inn i ovnen: {0} °C',Math.round(CSB.pre))+' · '+kwh()+' kWh/t',inj:()=>t_('Avgass ved ovnen: ca. {0} °C',Math.round(csGasT(CSG.xf))),duct:()=>t_('Avgass ved uttaket: ca. {0} °C',Math.round(csGasT(CSG.xs+6))),
   filter:()=>'',car:()=>fd,door:()=>t_('Slagg {0}/{1}',S.pot,potMax()),pit:()=>S.pot+'/'+potMax()+(lv('slaggbil')?' · '+t_('Slaggbil'):''),
   robot:()=>(TROB.n?t_('Siste måling: {0} °C',TROB.val)+' · '+t_('{0} målinger',TROB.n):t_('Venter på første måling'))}[h.id]();
  return{t:ti,d:tx,n}}
 case'helper':{const r=h.h.r,hi=HIRE[r];return{t:hName(hi),d:ixs(IX.hire[r])+' '+ixs(IX.hire.all),n:t_('Hjelpere {0} av {1}',lv(hi.id),hi.costs.length)}}
 case'furnace':{const E=E_();return{t:t_(E.n),d:ixs(IX.era[era()]),n:furnNums()}}
 case'rjf':{if(rjClosed()){const[,tx]=ix4(IX.misc.closed);return{t:t_(RJE[rjEra()].n),d:tx,n:t_('NEDLAGT')}}const st=status('rj');return{t:t_(RJE[rjEra()].n),d:ixs(IX.rje[rjEra()]),n:t_('{0} t/min råjern',tf(RJ.rate*60))+' · '+t_('i ovnen {0} t',tf(S.rj.hearth))+(st&&st.lv?' · '+st.t:'')}}
 case'up':{const u=h.u;return infoFor({type:'pad',d:PAD['u_'+u.id]})}
 case'cast':{const[ti,tx]=ix4(IX.cast[h.id]);const n={turret:()=>upNums(UPm.turret),shroud:()=>t_(CAST.pour?'Skjermrør på':'Skjermrør parkert'),tundish:()=>t_('Stålnivå {0} %',Math.round(CAST.tlev*100)),
   mould:()=>t_('{0} av {1} strenger i bruk',nStr(),8)+' · '+upNums(UPm.strands),spray:()=>upNums(UPm.caster),wsu:()=>upNums(UPm.caster),cutter:()=>upNums(UPm.torch),bed:()=>t_('{0} emner på kjølesenga',CAST.bed.length)}[h.id]();
  return{t:ti,d:tx,n}}
 case'misc':{const[ti,tx]=ix4(IX.misc[h.id]);let n='',T2=ti;
  if(h.id==='hmL')n=t_('råjern {0} t',tf(S.hm))+' / '+Math.round(hmCap())+' t';
  else if(h.id==='pigm')n=PILE.pig.length+' '+t_('stk');
  else if(h.id==='train')n=tf(yardT(SRCm.ore))+'/'+oreYardCap()+' t';
  else if(h.id==='desk'){const hi=HIRE[h.r];n=hName(hi)+' · '+t_('Hjelpere {0} av {1}',lv(hi.id),hi.costs.length)}
  return{t:T2,d:tx,n}}
 case'zone':{const z=h.z,built=zoneBuilt(z),nb=nextBuild();
  if(!built&&!(z.rj&&rjClosed())){const[ti,tx]=ix4(IX.misc.plot);const b=nb&&(ZN[nb.z]===z||(nb.id==='vv'&&(z.id==='gjv'||z.id==='vv'))||(nb.id==='stel'&&z.id==='salg2'))?nb:null;
   return{t:ti+(b?' · '+t_(b.n):''),d:b?tx.replace('{0}',t_(b.n))+' '+t_(b.d):ixs(IX.zone[z.id]),n:b?kr(b.cost):''}}
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
