import { StoryNode } from './types';

export const STORY_NODES: Record<string, StoryNode> = {
  // ── CHAPTER 1: AWAKENING ─────────────────────────────────────
  intro: {
    id: 'intro',
    chapterNumber: 1,
    title: 'Chapter I — The Amnesiac',
    text: `You open your eyes to the smell of burning gold.

The Aurum Citadel stretches above you — spires of imperial brass catching a sun that feels wrong, too bright, too close. You are lying in the market district. People step around you. No one helps.

You remember nothing. Not your name. Not your face. Not why your hands are glowing faint blue.

A child stops and stares at your hands. "Aether-touched," she whispers, and runs.

Across the square, two Imperial Guards are pointing at you. One reaches for his blade.

You have seconds to decide.`,
    choices: [
      {
        id: 'c1', text: 'Stand and face the guards. You have nothing to hide.',
        effect: { statBonus: { CHA: 2, RES: 2 }, setFlag: 'imperial_ally' },
        nextNodeId: 'ch1_face_guards',
      },
      {
        id: 'c2', text: 'Run. The alley to your left is dark and narrow.',
        effect: { statBonus: { SPD: 2, DEX: 2 }, setFlag: 'fringe_sympathizer' },
        nextNodeId: 'ch1_run',
      },
      {
        id: 'c3', text: 'Channel the blue glow in your hands. You don\'t know what it does. You do it anyway.',
        effect: { statBonus: { AET: 4, INT: 2 }, setFlag: 'aether_awakened' },
        nextNodeId: 'ch1_aether',
      },
    ],
  },

  ch1_face_guards: {
    id: 'ch1_face_guards',
    chapterNumber: 1,
    title: 'The Imperial Gambit',
    text: `You raise your hands — the glowing ones — and speak clearly.

"I am not your enemy."

The guards hesitate. The senior one, a scarred woman with a captain's insignia, studies you with the practiced eye of someone who has seen too many liars.

"Aether-touched civilian in the market district," she says slowly. "You know what the Inquisitors do to your kind?"

She steps closer. Her voice drops.

"I'm Captain Maren. I'm going to pretend I didn't see you. But you owe me. And I collect."

She turns away. Her partner follows, confused.

You are free. For now. And you have a contact inside the empire.`,
    choices: [
      {
        id: 'c1', text: 'Find Captain Maren later. An imperial contact could be valuable.',
        effect: { setFlag: 'maren_contact', goldReward: 0 },
        nextNodeId: 'ch1_to_ashfields',
      },
      {
        id: 'c2', text: 'Leave immediately. Trust no one in the empire.',
        effect: { statBonus: { PER: 2 } },
        nextNodeId: 'ch1_to_ashfields',
      },
    ],
  },

  ch1_run: {
    id: 'ch1_run',
    chapterNumber: 1,
    title: 'The Alley Network',
    text: `You sprint into the alley before the guards can react.

The narrow passages of the Aurum Citadel's underbelly swallow you whole. You run until your lungs burn, until the shouts fade, until you find yourself in a basement that smells of old smoke and older secrets.

A figure sits at a table. Hooded. Waiting.

"I've been watching you since you woke up," they say. "You're not the first Aether-touched to fall from the sky in this city. You're just the first one the empire didn't immediately execute."

They slide a map across the table. The Ashfields are marked.

"Go there. Someone is waiting for you. Someone who knew you before you forgot yourself."`,
    choices: [
      {
        id: 'c1', text: 'Take the map. Ask no questions.',
        effect: { setFlag: 'fringe_contact', addItem: 'void_compass' },
        nextNodeId: 'ch1_to_ashfields',
      },
      {
        id: 'c2', text: 'Demand to know who they are first.',
        effect: { statBonus: { WIS: 2, PER: 2 } },
        nextNodeId: 'ch1_run_demand',
      },
    ],
  },

  ch1_run_demand: {
    id: 'ch1_run_demand',
    chapterNumber: 1,
    title: 'The Hooded Figure',
    text: `The figure pauses. Then laughs — a short, surprised sound.

"You always did ask too many questions."

They pull back their hood. A woman, older, with eyes the color of void-touched stone. A scar runs from her left temple to her jaw.

"My name is Rael. I'm a Fringe commander. And I knew you — the you before the amnesia — better than anyone."

She stands.

"The empire didn't give you amnesia. You did it to yourself. You had a reason. I don't know what it was. But the Ashfields will."

She hands you the map and a small token — an AETH crystal, glowing faint gold.

"Don't spend that. It's a key."`,
    choices: [
      {
        id: 'c1', text: 'Trust Rael. Head to the Ashfields.',
        effect: { setFlag: 'rael_trusted', addItem: 'aethrix_token_item' },
        nextNodeId: 'ch1_to_ashfields',
      },
    ],
  },

  ch1_aether: {
    id: 'ch1_aether',
    chapterNumber: 1,
    title: 'The Pulse',
    text: `The blue light in your hands surges.

It doesn't explode. It doesn't attack. It pulses — a single wave of energy that radiates outward in a perfect circle, passing through every person in the market square.

Everyone stops. Everyone looks at you.

Then they look at each other. And they start helping each other. A merchant picks up a dropped coin and returns it. A guard helps an old man with his cart. A child stops crying.

The pulse fades. The moment passes.

The two guards who were coming for you are now helping a woman whose stall collapsed. They've forgotten you entirely.

You don't understand what you did. But you feel it: the Aethrix is not just power. It's something older. Something that remembers what people are supposed to be.`,
    choices: [
      {
        id: 'c1', text: 'Leave while everyone is distracted. Get to the Ashfields.',
        effect: { statBonus: { AET: 3, SPR: 3 }, setFlag: 'aether_awakened', aethReward: 10 },
        nextNodeId: 'ch1_to_ashfields',
      },
    ],
  },

  ch1_to_ashfields: {
    id: 'ch1_to_ashfields',
    chapterNumber: 1,
    title: 'The Road to Ash',
    text: `The Ashfields lie east of the capital, a day's walk through scorched earth and old bones.

You travel through the night. The sky above the fields is permanently grey — ash suspended in the upper atmosphere from a battle fought 400 years ago. The ash never settled. The dead never rested.

At the edge of the fields, you find a camp. A single fire. A single figure.

He is old. Impossibly old. He wears the uniform of an imperial soldier from an era that no longer exists. He looks up when you approach, and his eyes go wide.

"You came back," he says. "I told them you would."

He reaches into his coat and produces a sealed letter. Your name is on it — written in your own handwriting.

"You left this for yourself," he says. "Before you forgot."`,
    choices: [
      {
        id: 'c1', text: 'Open the letter.',
        effect: { setFlag: 'letter_opened' },
        nextNodeId: 'ch2_the_letter',
      },
      {
        id: 'c2', text: 'Ask the old soldier who he is first.',
        effect: { statBonus: { WIS: 3 } },
        nextNodeId: 'ch2_old_soldier',
      },
    ],
  },

  // ── CHAPTER 2: THE LETTER ────────────────────────────────────
  ch2_old_soldier: {
    id: 'ch2_old_soldier',
    chapterNumber: 2,
    title: 'The Eternal Veteran',
    text: `"Who am I?" He smiles. It doesn't reach his eyes.

"I am Sergeant Aldous Vane. I died in the Battle of the Ashfields, Age 412. I have been waiting here since."

He holds up his hand. It is translucent. You can see the fire through it.

"You bound me here. You said you needed a witness. Someone who would still be here when you returned." He pauses. "I didn't agree to it. But I couldn't refuse. The Aethrix doesn't ask."

He gestures at the letter.

"Read it. Then decide what you want to do with what you learn."`,
    choices: [
      {
        id: 'c1', text: 'Open the letter.',
        effect: { setFlag: 'letter_opened' },
        nextNodeId: 'ch2_the_letter',
      },
    ],
  },

  ch2_the_letter: {
    id: 'ch2_the_letter',
    chapterNumber: 2,
    title: 'A Letter to Yourself',
    text: `The letter is written in a precise, urgent hand. Your hand.

---

*If you are reading this, the procedure worked. You forgot everything. Good.*

*Here is what you need to know:*

*The Tiena-Nueble is not what it claims to be. The empire was founded on a lie — the Aethrix token was not discovered. It was stolen. From the people of Solmara. From the civilization that built the Origin Point.*

*The emperor knows. He has always known. The empire runs on stolen power.*

*I tried to expose this. They came for me. I had one option: forget everything and start over, before they could extract the information from my mind.*

*The Aethrix token — contract 6MevaibDFB4qgLvdhrPSkmrSjGadaJeSWDQZW8tQpump — is the key to everything. It is not just currency. It is the original power source of the pre-empire civilization. It belongs to everyone.*

*Go to Solmara. Find the Origin Point. Finish what I started.*

*— Ess*

---

You fold the letter. The old soldier watches you.

"Well?" he asks.`,
    choices: [
      {
        id: 'c1', text: '"I\'m going to expose the empire." The truth has to come out.',
        effect: { statBonus: { RES: 4, CHA: 3 }, setFlag: 'truth_seeker' },
        nextNodeId: 'ch2_resolve',
      },
      {
        id: 'c2', text: '"I need more information before I act." This could be a trap.',
        effect: { statBonus: { WIS: 4, PER: 3 }, setFlag: 'cautious_path' },
        nextNodeId: 'ch2_cautious',
      },
      {
        id: 'c3', text: '"The empire has order. Maybe the lie is necessary." Power requires sacrifice.',
        effect: { statBonus: { STR: 3, INT: 3 }, setFlag: 'empire_path' },
        nextNodeId: 'ch2_empire_path',
      },
    ],
  },

  ch2_resolve: {
    id: 'ch2_resolve',
    chapterNumber: 2,
    title: 'The Truth Seeker',
    text: `The old soldier nods slowly.

"That's what you said last time too," he says. "Before they caught you."

He stands — or rather, his ghost stands, flickering at the edges.

"The difference is: last time you went alone. This time you have the Aethrix already awakened in you. Last time you were trying to steal the truth. This time you are the truth."

He points east, toward the distant shimmer of the Rift Gate.

"The empire will send Inquisitors. They always do when the Aethrix stirs. You need allies before you reach Solmara."

He begins to fade.

"I can rest now. You came back. That's all I needed to see."

He is gone. The fire goes out.

You are alone in the Ashfields. But for the first time since waking, you know exactly who you are.`,
    choices: [
      {
        id: 'c1', text: 'Head to the Rift Gate. Build strength before Solmara.',
        effect: { setFlag: 'chapter2_complete', aethReward: 25 },
        nextNodeId: 'ch3_world_opens',
      },
    ],
  },

  ch2_cautious: {
    id: 'ch2_cautious',
    chapterNumber: 2,
    title: 'The Careful Path',
    text: `"Smart," the old soldier says. "The last version of you wasn't careful enough."

He tells you what he knows: the empire has three Inquisitor teams already searching for you. The Fringe knows you're alive and is debating whether to help or exploit you. And somewhere in Nocthar, a woman named Rael has been waiting for you to resurface.

"The Obsidian Spire in Nocthar," he says. "It's been broadcasting your name for three months. Someone put that signal there. Someone who knew you were coming back."

He hands you a small amulet — cold iron, shaped like a compass.

"This will keep the Inquisitors from sensing your Aether signature. For a while."

He fades slowly, peacefully.

You have time. Use it wisely.`,
    choices: [
      {
        id: 'c1', text: 'Go to Nocthar first. Find out who is broadcasting your name.',
        effect: { setFlag: 'chapter2_complete', addItem: 'void_compass', aethReward: 20 },
        nextNodeId: 'ch3_world_opens',
      },
    ],
  },

  ch2_empire_path: {
    id: 'ch2_empire_path',
    chapterNumber: 2,
    title: 'The Imperial Temptation',
    text: `The old soldier goes very still.

"I've heard that argument before," he says quietly. "The emperor made it. Right before he ordered the Ashfields massacre."

He looks at you with something between pity and warning.

"The lie doesn't maintain order. The lie IS the disorder. Every war the empire fights is to keep people from asking the question you just answered."

He stands.

"I won't stop you from choosing the empire's side. But I'll tell you this: the Aethrix in your hands doesn't belong to the emperor. It never did. And it will not serve a lie."

He fades.

You are left with the letter, the cold ash, and a choice that feels heavier than it did a moment ago.`,
    choices: [
      {
        id: 'c1', text: 'Reconsider. The soldier\'s words have weight.',
        effect: { statBonus: { WIS: 3 }, setFlag: 'truth_seeker' },
        nextNodeId: 'ch2_resolve',
      },
      {
        id: 'c2', text: 'Hold the course. Report to the empire. See what they offer.',
        effect: { setFlag: 'empire_path', setFlag2: 'chapter2_complete' } as never,
        nextNodeId: 'ch3_world_opens',
      },
    ],
  },

  // ── CHAPTER 3: THE WORLD OPENS ───────────────────────────────
  ch3_world_opens: {
    id: 'ch3_world_opens',
    chapterNumber: 3,
    title: 'Chapter III — The Three Continents',
    text: `The world is larger than the empire admits.

Three continents. Three truths. Three paths to the Origin Point.

Valdris — the iron heartland — where the empire's power is absolute and its secrets are buried deepest.

Nocthar — the shadow continent — where the Fringe fights a war the empire pretends is already won.

Solmara — the sunken archive — where the answers to every question are waiting, 800 years underwater.

You cannot do this alone. You need strength, allies, and the AETH token's full power.

The world is open. Where do you go first?`,
    choices: [
      {
        id: 'c1', text: 'Explore Valdris. Master the empire\'s own territory.',
        effect: { setFlag: 'started_valdris' },
        nextNodeId: 'ch3_valdris',
      },
      {
        id: 'c2', text: 'Cross to Nocthar. Find Rael and the Fringe.',
        effect: { setFlag: 'started_nocthar' },
        nextNodeId: 'ch3_nocthar',
      },
      {
        id: 'c3', text: 'Sail to Solmara. Go straight to the source.',
        effect: { setFlag: 'started_solmara' },
        nextNodeId: 'ch3_solmara',
      },
    ],
  },

  ch3_valdris: {
    id: 'ch3_valdris',
    chapterNumber: 3,
    title: 'Into the Heartland',
    text: `Valdris is a continent of controlled beauty. Every road is maintained. Every city is fortified. Every citizen is watched.

But beneath the gold and iron, something is rotting.

The mines of Keth have gone silent. The Rift Gate is destabilizing. And in the capital, someone has been leaving messages for you — written in the same hand as your letter.

Someone else knows what you know. Someone still inside the empire.

The Ashfields are behind you. The Iron Mines are ahead. And somewhere in the depths of Keth, the first piece of the truth is waiting.`,
    choices: [
      {
        id: 'c1', text: 'Enter the world. Begin your journey through Valdris.',
        effect: { setFlag: 'valdris_active' },
        nextNodeId: 'world_hub',
      },
    ],
  },

  ch3_nocthar: {
    id: 'ch3_nocthar',
    chapterNumber: 3,
    title: 'Into the Shadow',
    text: `Nocthar does not welcome you. It simply does not kill you immediately, which passes for hospitality here.

Duskport is the only city that trades with the empire, and even here the tension is a physical thing — you can feel it in the way people stand, the way hands hover near weapons, the way every conversation has a second conversation underneath it.

Rael is here. You can feel it. The Fringe commander who knew you before you forgot yourself.

And above the city, visible even in daylight, the Obsidian Spire pulses with a signal that contains your name.

Someone has been waiting for you.`,
    choices: [
      {
        id: 'c1', text: 'Enter the world. Begin your journey through Nocthar.',
        effect: { setFlag: 'nocthar_active' },
        nextNodeId: 'world_hub',
      },
    ],
  },

  ch3_solmara: {
    id: 'ch3_solmara',
    chapterNumber: 3,
    title: 'Into the Archive',
    text: `Solmara smells of salt and old knowledge.

The ruins of the pre-empire civilization are everywhere — half-submerged in the luminescent sea, jutting from the crystal wastes, whispering from the depths of the Drowned City.

Tidehaven's archive holds a record of someone matching your description from 800 years ago. The same name. The same Aether signature. The same mission.

You are not the first Ess.

The question is: what happened to the last one?`,
    choices: [
      {
        id: 'c1', text: 'Enter the world. Begin your journey through Solmara.',
        effect: { setFlag: 'solmara_active' },
        nextNodeId: 'world_hub',
      },
    ],
  },

  world_hub: {
    id: 'world_hub',
    chapterNumber: 3,
    title: 'The Journey Continues',
    text: `Your path is set. The world awaits.

Explore the continents. Complete quests. Gather allies. Acquire the AETH token's power.

The Origin Point in Solmara is the final destination — but the road there will define who you are when you arrive.

The empire is watching. The Fringe is waiting. The Aethrix is humming in your hands.

What you do next is up to you.`,
    choices: [
      {
        id: 'c1', text: 'Continue the journey. [Open World Map]',
        effect: { setFlag: 'world_unlocked' },
        nextNodeId: 'world_hub',
      },
    ],
  },

  // ── FINAL CHAPTER ────────────────────────────────────────────
  final_choice: {
    id: 'final_choice',
    chapterNumber: 9,
    title: 'Chapter IX — The Origin Point',
    text: `You stand at the Origin Point.

The ground glows gold. The air tastes like the first breath ever taken. Time moves strangely here — you can see echoes of the past overlaid on the present, like transparencies stacked on top of each other.

The First Smith stands before you. Ancient. Patient. Burning with quiet power.

"You made it," they say. "The last Ess didn't. The one before that didn't either."

They gesture at the Origin Point's core — a sphere of pure Aethrix energy, the size of a fist, burning with the light of every AETH token ever created.

"The empire stole this power. It has been running on it for 800 years. You can take it back — but the empire collapses. Millions suffer in the transition."

They pause.

"Or you can destroy it. The Aethrix ends. The empire loses its power source. It falls slowly, over generations. Less suffering. Less justice."

"Or," they say, and their voice changes, "you can become it. Merge with the Origin Point. Distribute the Aethrix to everyone, equally, permanently. The token — 6MevaibDFB4qgLvdhrPSkmrSjGadaJeSWDQZW8tQpump — becomes what it was always meant to be. Not a weapon. Not a currency. A foundation."

"Choose."`,
    choices: [
      {
        id: 'c1', text: 'Reclaim the Aethrix. Collapse the empire now. Justice, even if it hurts.',
        effect: { setFlag: 'ending_reclaim', aethReward: 300 },
        nextNodeId: 'ending_reclaim',
      },
      {
        id: 'c2', text: 'Destroy the Origin Point. End the Aethrix. Let the world heal slowly.',
        effect: { setFlag: 'ending_destroy', aethReward: 200 },
        nextNodeId: 'ending_destroy',
      },
      {
        id: 'c3', text: 'Become the Aethrix. Distribute the power. Build the new world.',
        effect: { setFlag: 'ending_become', aethReward: 500 },
        nextNodeId: 'ending_become',
      },
    ],
  },

  ending_reclaim: {
    id: 'ending_reclaim',
    chapterNumber: 9,
    title: 'Ending I — The Reckoning',
    text: `You reach into the Origin Point and pull.

The Aethrix tears free from the empire's infrastructure in a single, catastrophic moment. Every imperial machine stops. Every Aether-powered weapon goes dark. The Tiena-Nueble, which has run on stolen power for 800 years, collapses in a single night.

The transition is brutal. Cities go dark. Supply lines fail. There is suffering.

But there is also something else: for the first time in 800 years, the power belongs to no one. And therefore, to everyone.

The AETH token — free, distributed, ungoverned — becomes the foundation of what comes next.

You stand in the ruins of the Origin Point, exhausted, alive, and finally, fully yourself.

The empire is gone. The work of building what comes next begins now.

**ENDING I: THE RECKONING — COMPLETE**`,
    choices: [],
    isEnding: true,
  },

  ending_destroy: {
    id: 'ending_destroy',
    chapterNumber: 9,
    title: 'Ending II — The Long Peace',
    text: `You drive your hands into the Origin Point's core and close your fingers around the Aethrix.

It fights you. It wants to exist. It has always wanted to exist.

You hold on.

The light goes out slowly — not an explosion, but a sunset. The Aethrix fades over the course of an hour, draining from every token, every weapon, every imperial machine, until there is nothing left but warm metal and old stone.

The empire does not collapse. It weakens. Over decades, it reforms. Over generations, it becomes something else — something that doesn't need stolen power to function.

It is not justice. It is not fast. But it is survivable.

You walk out of the Origin Point into a world that is, for the first time, running on its own.

**ENDING II: THE LONG PEACE — COMPLETE**`,
    choices: [],
    isEnding: true,
  },

  ending_become: {
    id: 'ending_become',
    chapterNumber: 9,
    title: 'Ending III — The Aethrix',
    text: `You step into the Origin Point's core.

It doesn't hurt. It feels like remembering.

The Aethrix flows through you and out of you simultaneously — distributed in a single pulse across every continent, every person, every living thing. Not as a weapon. Not as a currency controlled by an empire. As a foundation. As a right.

The AETH token — 6MevaibDFB4qgLvdhrPSkmrSjGadaJeSWDQZW8tQpump — becomes what it was always meant to be: a shared resource, a common power, a proof that the world's energy belongs to the world.

You are no longer Ess. You are no longer one person.

You are the Aethrix.

And for the first time in 800 years, the power is free.

**ENDING III: THE AETHRIX — COMPLETE**
*True Ending*`,
    choices: [],
    isEnding: true,
  },
};
