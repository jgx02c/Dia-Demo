interface DemoScriptType {
  title: string;
  subtitle: string;
  caseDetails: {
    name: string;
    date: string;
    location: string;
    time: string;
  };
  participants: string[];
  dialogue: Array<{
    speaker: string;
    text: string;
  }>;
}

export const demoScript: DemoScriptType = {
  title: "Demo Test Script",
  subtitle: "Press \"Start Transcription\" to begin.",
  caseDetails: {
    name: "Smith v. XYZ Corporation",
    date: "October 10, 2024",
    location: "Law Offices of Johnson & Associates, 123 Main Street, Anytown, USA",
    time: "10:00 AM"
  },
  participants: [
    "Mr. John Smith - Plaintiff",
    "Mr. David Johnson - Plaintiff's Attorney",
    "Ms. Rachel Green - Witness",
    "Ms. Amanda Davis - Court Reporter"
  ],
  dialogue: [
    {
      speaker: "David Johnson",
      text: "Good morning, Ms. Green. Thank you for being here today. Your testimony is crucial to this case. To begin, could you please state your full name for the record?"
    },
    {
      speaker: "Rachel Green",
      text: "Good morning. My name is Rachel Green, and I am a resident of Anytown, USA."
    },
    {
      speaker: "David Johnson",
      text: "Thank you, Ms. Green. Were you present at the time of the incident involving Mr. John Smith and the XYZ Corporation?"
    },
    {
      speaker: "Rachel Green",
      text: "Yes, I was present at the scene."
    },
    {
      speaker: "David Johnson",
      text: "Can you please describe in detail what you observed on the day of the incident?"
    },
    {
      speaker: "Rachel Green",
      text: "Certainly. I witnessed Mr. Smith attempting to cross the street at the designated crosswalk. As he entered the intersection, the XYZ Corporation's delivery truck approached rapidly from the right. I noticed Mr. Smith looked both ways before stepping off the curb, demonstrating due caution."
    },
    {
      speaker: "David Johnson",
      text: "Thank you for that description, Ms. Green. For clarity, would you elaborate on the behavior of Mr. Smith just prior to the incident?"
    },
    {
      speaker: "Rachel Green",
      text: "Yes, of course. As Mr. Smith reached the middle of the crosswalk, he appeared vigilant and aware of his surroundings. He made eye contact with the drivers waiting at the stoplight, indicating he was attentive to the traffic conditions."
    },
    {
      speaker: "David Johnson",
      text: "I appreciate your detailed observation, Ms. Green. Now, I would like to refer to Exhibit A, which is a transcript of the live feed recording from the day of the incident. Could you please read the highlighted sentence?"
    },
    {
      speaker: "Rachel Green",
      text: "Certainly. The highlighted sentence reads, \"The pedestrian seemed to be crossing the street without paying attention to oncoming traffic.\""
    },
    {
      speaker: "David Johnson",
      text: "Ms. Green, does this statement accurately reflect what you observed?"
    },
    {
      speaker: "Rachel Green",
      text: "Actually, no. As I mentioned earlier, Mr. Smith was alert and took all necessary precautions before crossing. This statement does not accurately capture the reality of the situation."
    },
    {
      speaker: "David Johnson",
      text: "Thank you for clarifying that important point, Ms. Green. No further questions from me at this time."
    },
    {
      speaker: "Narrator",
      text: "[Mr. Johnson sits down, and Ms. Green looks expectantly at the Defendant's attorney, who begins his questioning.]"
    },
    {
      speaker: "Defendant's Attorney",
      text: "Good morning, Ms. Green. I appreciate your presence here today. I just have a few questions for you regarding your observations. Can you tell me how far away you were from the intersection when the accident occurred?"
    },
    {
      speaker: "Rachel Green",
      text: "I was standing on the corner, approximately 20 feet away from the crosswalk."
    },
    {
      speaker: "Defendant's Attorney",
      text: "And did you have a clear view of the intersection during the incident?"
    },
    {
      speaker: "Rachel Green",
      text: "Yes, I had an unobstructed line of sight to the area where Mr. Smith was crossing the street."
    },
    {
      speaker: "Defendant's Attorney",
      text: "Thank you, Ms. Green. Were there any distractions or obstacles that might have affected your view at the time of the incident?"
    },
    {
      speaker: "Rachel Green",
      text: "No, there were no distractions. The street was relatively clear, and I was focused on the situation unfolding in front of me."
    },
    {
      speaker: "Defendant's Attorney",
      text: "Thank you for your honesty, Ms. Green. Were there any other pedestrians in the area that you noticed during this time?"
    },
    {
      speaker: "Rachel Green",
      text: "Yes, there were a few other pedestrians, but they were further down the street, waiting for the light to change. None of them were close to Mr. Smith at the moment of the accident."
    },
    {
      speaker: "Defendant's Attorney",
      text: "That's helpful to know. Thank you for your cooperation, Ms. Green. No further questions from me."
    },
    {
      speaker: "Narrator",
      text: "[The deposition concludes, and Ms. Amanda Davis prepares to close the record.]"
    },
    {
      speaker: "Amanda Davis",
      text: "This concludes the deposition of Ms. Rachel Green. The time is now 10:30 AM. Thank you all for your participation."
    }
  ]
}; 