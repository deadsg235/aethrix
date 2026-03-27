import { Faction } from './types';

export const FACTIONS: Faction[] = [
  {
    id: 'tiena_nueble',
    name: 'The Tiena-Nueble',
    description: 'The One World Government. The empire that spans everything.',
    lore: `The Tiena-Nueble was founded in Age 0 by the First Emperor, whose name has been erased from all records. 
    The empire claims this was done out of humility. Historians believe it was done out of fear — fear that knowing 
    his name would allow people to understand how ordinary he was, and how extraordinary the lie he built was.
    
    The empire runs on three things: the Aethrix token, the loyalty of its soldiers, and the ignorance of its citizens.
    Two of these are running out.`,
    alignment: 'empire',
    maxReputation: 10000,
    reputationTiers: [
      { threshold: 0,    title: 'Unknown',      perks: [] },
      { threshold: 500,  title: 'Recognized',   perks: ['Access to imperial markets', '5% discount on imperial goods'] },
      { threshold: 2000, title: 'Trusted',       perks: ['Imperial safe passage', 'Access to restricted areas', '10% discount'] },
      { threshold: 4000, title: 'Honored',       perks: ['Imperial guard assistance in combat', '15% discount', 'Access to imperial armory'] },
      { threshold: 7000, title: 'Champion',      perks: ['Personal imperial escort', '20% discount', 'Access to legendary imperial forge'] },
      { threshold: 10000, title: 'Imperial Hand', perks: ['Full imperial authority', 'Command imperial troops', 'Access to emperor\'s vault'] },
    ],
  },
  {
    id: 'the_fringe',
    name: 'The Fringe Coalition',
    description: 'Everything the empire rejected. United only by survival.',
    lore: `The Fringe is not an organization. It is a consequence. Every person the empire exiled, every race it 
    conquered, every truth it suppressed — they all ended up in the same place, beyond the empire's reach.
    
    Commander Rael has held the coalition together through sheer force of will and the understanding that 
    the moment they stop fighting each other, they can start fighting the empire. That moment is approaching.`,
    alignment: 'fringe',
    maxReputation: 10000,
    reputationTiers: [
      { threshold: 0,    title: 'Outsider',     perks: [] },
      { threshold: 500,  title: 'Tolerated',    perks: ['Access to fringe black markets', 'Safe passage in fringe territory'] },
      { threshold: 2000, title: 'Ally',          perks: ['Fringe scouts assist in combat', 'Access to rare fringe weapons'] },
      { threshold: 4000, title: 'Brother/Sister', perks: ['Fringe safe houses available', 'Access to fringe legendary smith'] },
      { threshold: 7000, title: 'Commander',    perks: ['Command fringe strike teams', 'Access to void weapons cache'] },
      { threshold: 10000, title: 'The Fringe Itself', perks: ['Fringe armies follow you', 'Access to all fringe secrets', 'Rael\'s personal weapon'] },
    ],
  },
  {
    id: 'rift_wardens',
    name: 'The Rift Wardens',
    description: 'Ancient order dedicated to containing the rifts. Dwindling. Desperate.',
    lore: `The Rift Wardens predate the empire by 400 years. They were created by the Solmaran civilization 
    to monitor and contain the rifts that began appearing after the first Aethrix experiments.
    
    The empire absorbed them in Age 200, stripped their authority, and used their knowledge to exploit 
    the rifts rather than contain them. The Wardens who refused were exiled. The ones who stayed 
    watch helplessly as the rifts grow larger every year.`,
    alignment: 'neutral',
    maxReputation: 10000,
    reputationTiers: [
      { threshold: 0,    title: 'Civilian',     perks: [] },
      { threshold: 500,  title: 'Initiate',     perks: ['Access to warden archives', 'Rift navigation assistance'] },
      { threshold: 2000, title: 'Warden',       perks: ['Rift traversal abilities', 'Access to warden armory'] },
      { threshold: 4000, title: 'Senior Warden', perks: ['Rift sealing knowledge', 'Access to ancient warden relics'] },
      { threshold: 7000, title: 'Warden Captain', perks: ['Command warden squads', 'Access to rift forge'] },
      { threshold: 10000, title: 'Warden Archon', perks: ['Full rift mastery', 'Access to the First Seal', 'Dimensional sovereignty'] },
    ],
  },
  {
    id: 'solmaran_remnant',
    name: 'The Solmaran Remnant',
    description: 'Survivors of the civilization that created the Aethrix. Ancient. Grieving.',
    lore: `The Solmaran civilization was destroyed 800 years ago in a single night. Their city sank. 
    Their people scattered. Their knowledge was stolen by the empire and rebranded as imperial discovery.
    
    The Remnant are the descendants of those who survived. They have spent 800 years trying to 
    reclaim what was taken. They are very patient. They are also very angry.`,
    alignment: 'ancient',
    maxReputation: 10000,
    reputationTiers: [
      { threshold: 0,    title: 'Stranger',     perks: [] },
      { threshold: 500,  title: 'Known',        perks: ['Access to Solmaran archives', 'Ancient knowledge fragments'] },
      { threshold: 2000, title: 'Trusted',      perks: ['Access to pre-empire relics', 'Solmaran crafting recipes'] },
      { threshold: 4000, title: 'Kin',          perks: ['Access to sunken city', 'Ancient Solmaran weapons'] },
      { threshold: 7000, title: 'Keeper',       perks: ['Access to Origin Point knowledge', 'Mythic Solmaran forge'] },
      { threshold: 10000, title: 'The Last Solmaran', perks: ['Full access to pre-empire technology', 'Aethrix origin knowledge', 'The First Weapon'] },
    ],
  },
  {
    id: 'void_cult',
    name: 'The Void Congregation',
    description: 'They worship what lives in the void. They may not be wrong to.',
    lore: `The Void Congregation believes the void is not empty. They believe something lives there — 
    something ancient, something patient, something that has been watching the Aethrix experiments 
    with great interest.
    
    Most people dismiss them as madmen. The Rift Wardens do not dismiss them. The Rift Wardens 
    are very afraid of them.`,
    alignment: 'void',
    maxReputation: 10000,
    reputationTiers: [
      { threshold: 0,    title: 'Uninitiated',  perks: [] },
      { threshold: 500,  title: 'Seeker',       perks: ['Access to void knowledge', 'Void resistance +10%'] },
      { threshold: 2000, title: 'Initiate',     perks: ['Void abilities unlocked', 'Void creatures neutral'] },
      { threshold: 4000, title: 'Acolyte',      perks: ['Void empowerment in dark areas', 'Access to void forge'] },
      { threshold: 7000, title: 'Void Speaker', perks: ['Void creatures fight for you', 'Access to void mythic items'] },
      { threshold: 10000, title: 'The Void\'s Voice', perks: ['Void immunity', 'Command void entities', 'The Void\'s Gift — unknown power'] },
    ],
  },
  {
    id: 'free_cities',
    name: 'The Free Cities Alliance',
    description: 'Independent city-states that refuse both empire and fringe.',
    lore: `The Free Cities exist in the gaps between the empire's reach and the fringe's chaos. 
    They survive through trade, diplomacy, and the careful maintenance of neutrality.
    
    They are the only places in the world where an imperial soldier and a fringe raider 
    can sit at the same table without drawing weapons. This is either their greatest achievement 
    or their greatest weakness, depending on who you ask.`,
    alignment: 'neutral',
    maxReputation: 10000,
    reputationTiers: [
      { threshold: 0,    title: 'Traveler',     perks: [] },
      { threshold: 500,  title: 'Regular',      perks: ['Access to free city markets', 'Neutral territory protection'] },
      { threshold: 2000, title: 'Friend',       perks: ['Free city safe houses', 'Access to rare trade goods'] },
      { threshold: 4000, title: 'Patron',       perks: ['Free city guard assistance', 'Access to auction house'] },
      { threshold: 7000, title: 'Benefactor',   perks: ['Free city militia support', 'Access to master craftsmen'] },
      { threshold: 10000, title: 'City Father/Mother', perks: ['Command free city forces', 'Access to all trade routes', 'The Merchant\'s Crown'] },
    ],
  },
];
