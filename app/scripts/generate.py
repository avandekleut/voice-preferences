import tts
import os.path

data = {
    # INSTRUCTIVE
    "Guiding you through a workout":"Next, perform 20 bodyweight squats. Stand with your feet shoulder width apart with your feet facing forward. Bend at the knees, keeping your back straight. Lower your hips until they are level with your knees. Stand up and repeat.",
    "Helping you follow a recipe":"Preheat the oven to 350 degrees. While the oven is preheating, mash bananas until smooth. Mix in the melted butter. Mix together the beaten egg, sugar and vanilla. Add to the banana and butter mixture. Slowly mix in the flour and baking soda.",
    "Giving you directions to the museum":"Your destination is 145 Queen Street. You will arrive in 14 minutes. In 200 meters, at the roundabout, take the second exit to remain on West Hill avenue. Continue straight for 2 kilometers.",
    "Reminding you to schedule car maintenance":"The last time you scheduled car maintenance was August 17th 2019. You should get your oil and windshield washers changed and get a routine checkup. Would you like me to call Honda Service for you now?",
    "Warning you your heartrate is high":"Your heartbeat is currently 126 beats per second. Take a minute to breathe and relax. Take a break if you need to.",

    # INFORMATIVE
    "Delivering the weather forecast":"It looks like it's going to be a gloomy day today. There is a 100% chance of showers until 1:00pm today. After that, it's overcast with a 60% chance of rain. The high is 10 degrees and the low is -1.",
    "Getting your meetings and appointments":"You have three items on your schedule today. You have a marking meeting in DC3017 at 2:00pm, CS898 at 4:30pm and gym at 7:00pm.",
    "Making suggestions for a restaurant":"According to TripAdvisor, there are 4 restaurants rated over 4 stars in the nearby area. Neptune's Fish and Chips has 4.5 stars, Ye's Sushi has 4.8 stars, Rodeo House has 4.1 stars, and Everest Cafe and Bar as 4.7 stars.",
    "Identifying a song that's playing":"According to Shazam, you are listening to Californication by the Red Hot Chili Peppers.",
    "Reading a contact's information":"Dave Masterson's phone number is 647-245-1797 and his email is davemasterson@gmail.com.",
}

for name in "ABCDEF":
    voice = tts.TTS(name=name)
    for filename in data:
        voice.speak(data[filename], outloud=False, filename=os.path.join('audio', name, filename))
        # voice.speak(data[filename], outloud=True)
