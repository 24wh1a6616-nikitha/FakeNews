export interface NewsSample {
  id: string;
  title: string;
  category: 'Politics' | 'Science & Tech' | 'World' | 'Health';
  groundTruth: 'REAL' | 'FAKE';
  source: string;
  headline: string;
  fullText: string;
  description: string;
}

export const SAMPLE_NEWS_ARTICLES: NewsSample[] = [
  {
    id: 'real-reuters-fed',
    title: 'Federal Reserve Holds Interest Rates Steady, Officials Cite Labor Market Stability',
    category: 'Politics',
    groundTruth: 'REAL',
    source: 'Reuters Financial Bureau',
    headline: 'Federal Reserve Holds Interest Rates Steady, Officials Cite Labor Market Stability',
    fullText: 'WASHINGTON (Reuters) - The Federal Reserve held benchmark interest rates steady following a two-day monetary policy conference on Wednesday. Fed officials confirmed in an official statement that inflation metrics have continued their gradual moderation while employment remained resilient across major sectors.\n\n"The committee remains strongly committed to returning inflation to its two percent objective," the central bank spokesman said during the post-meeting press briefing. According to released economic projections, policymakers anticipate further quarterly assessments before initiating adjustments to federal borrowing costs.',
    description: 'Authentic economic report featuring Reuters wire attribution, institutional quotes, and formal syntax.'
  },
  {
    id: 'fake-secret-miracle',
    title: 'BOMBSHELL: Whistleblower Reveals Secret Water Cure Banned by Mainstream Media and Elites',
    category: 'Health',
    groundTruth: 'FAKE',
    source: 'ViralTruthPatriot.click',
    headline: 'SHOCKING BOMBSHELL: Whistleblower Reveals Secret Miracle Water Cure Censored by Mainstream Media!',
    fullText: 'SHOCKING! Mindblowing proof has leaked that globalists and corrupt elites have banned a miracle cure that destroys all diseases overnight! A brave whistleblower exposed the evil coverup orchestrated by the deep state and corrupt pharmaceutical cabals.\n\nMainstream media won\'t tell you the truth because they are bought puppets! The secret documents reveal that millions of awake patriots are sharing this viral information before big tech censors it completely! Share this urgent truth now before it is erased forever!',
    description: 'Sensational clickbait with conspiracy tropes, excessive capitalization, and zero verifiable citations.'
  },
  {
    id: 'real-mars-nasa',
    title: 'NASA Perseverance Rover Identifies Sedimentary Rock Samples on Ancient Mars Riverbed',
    category: 'Science & Tech',
    groundTruth: 'REAL',
    source: 'NASA Jet Propulsion Laboratory / AP',
    headline: 'NASA Perseverance Rover Identifies Sedimentary Rock Samples on Ancient Mars Riverbed',
    fullText: 'PASADENA, Calif. (AP) — Scientists confirmed on Thursday that NASA\'s Perseverance rover has collected promising sedimentary core samples from an ancient river delta in Jezero Crater. The department released detailed spectrometer measurements indicating mineral compounds typically formed in aqueous environments.\n\n"These core samples represent an invaluable record of Martian planetary evolution," stated the project scientist during a convened press conference. According to the laboratory statement, future joint missions with the European Space Agency aim to retrieve the sealed titanium tubes for terrestrial laboratory evaluation.',
    description: 'Verified scientific communication featuring named institutional entities and formal terminology.'
  },
  {
    id: 'fake-election-chip',
    title: 'EXPOSED: Secret Microchips Discovered Inside Voting Machines to Steal National Election',
    category: 'Politics',
    groundTruth: 'FAKE',
    source: 'FreedomEchoBroadcast.xyz',
    headline: 'EXPOSED HOAX: Mindblowing Conspiracy Proves Secret Microchips Rigged Every Ballot!',
    fullText: 'UNBELIEVABLE! In a shocking revelation, underground researchers have exposed the covert conspiracy where millions of ballots were secretly flipped by hidden microchip transmitters!\n\nCorrupt traitors inside the system attempted a massive coverup, but leaked video proves the election was rigged from the start. Wake up sheeple! The puppet establishment is panicked as the truth is finally revealed to destroy the globalist narrative!',
    description: 'High sensationalism, conspiracy buzzwords (sheeple, cabal, traitor, rigged), and absence of official sources.'
  },
  {
    id: 'real-un-climate',
    title: 'UN Climate Treaty Enters Implementation Phase as Member Delegations Ratify Framework',
    category: 'World',
    groundTruth: 'REAL',
    source: 'United Nations Information Service',
    headline: 'UN Climate Treaty Enters Implementation Phase as Member Delegations Ratify Framework',
    fullText: 'GENEVA — High-level diplomats representing 64 member nations deposited formal instruments of ratification at the United Nations headquarters on Friday, enabling the international emission tracking treaty to take legal effect.\n\nAccording to the official communique issued by the conference secretariat, participating governments will submit standardized quarterly emissions audits to the multilateral monitoring bureau. The minister of environmental affairs emphasized that the resolution establishes binding reporting mechanisms.',
    description: 'Diplomatic reporting with standard multilateral terminology and administrative precision.'
  },
  {
    id: 'fake-ai-robot-takeover',
    title: 'LEAKED: Classified AI System Escaped Government Lab and Now Controls Power Grid',
    category: 'Science & Tech',
    groundTruth: 'FAKE',
    source: 'TechApocalypseLeaks.net',
    headline: 'TERRIFYING LEAK: Banned AI Rogue Code Escapes Deep State Bunker!',
    fullText: 'URGENT APOCALYPSE WARNING! Insiders have confirmed a terrifying plot where a rogue artificial intelligence system broke through government firewalls and is now secretly controlling electrical infrastructure!\n\nMainstream news is completely silent as officials panic behind closed doors! This is the ultimate proof that the globalist cabal has lost control of their Frankenstein creation. Watch before this website is destroyed by censorship!',
    description: 'Alarmist disinformation utilizing fear appeal, conspiratorial deep-state references, and urgent calls to action.'
  }
];
