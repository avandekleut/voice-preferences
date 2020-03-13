import tts
import os
import os.path

data = {
    # TRAITS
    "Which is more masculine?":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sagittis pharetra mauris et ullamcorper. Proin in velit ante. Cras euismod fringilla ipsum, tristique est posuere et. Curabitur ut tincidunt massa, sit amet volutpat urna. Nulla facilisi. Nulla imperdiet, purus eget pulvinar tempor, nulla metus porta velit, et consectetur augue ipsum non erat. Aenean mauris id dui mollis rutrum vitae vitae lectus.",

    "Which is less mature?":"In malesuada tempor convallis. Libero semper hendrerit. Donec lacinia magna orci, scelerisque nulla finibus. Praesent erat leo, consequat at ex, ultricies sodales ipsum. Etiam vulputate suscipit diam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames turpis egestas. Aliquam faucibus orci et felis fringilla porta at quis.",

    "Which is more attractive?":"Proin sodales massa a ornare condimentum. Duis faucibus euismod massa, ut suscipit enim consectetur. Pellentesque urna finibus, malesuada felis eget, tempus dolor. Aenean a quam et enim efficitur porttitor. In hac habitasse platea dictumst. Vestibulum quis ex ornare, malesuada quam vitae, tempus magna. Morbi scelerisque ligula.",

    "Which is less confident?":"Etiam lacinia, ante et sodales posuere, mauris enim hendrerit lectus, id bibendum risus est sit amet nulla. Integer id venenatis nisl, mollis rhoncus risus. Duis scelerisque, ipsum fringilla elementum, tortor nunc cursus turpis, et posuere odio dui. Pellentesque eget est bibendum ornare mattis ut lacus. Donec vel imperdiet felis. Aenean in sapien pellentesque, viverra leo ut, iaculis augue.",

    "Which do you prefer?":"In gravida ipsum, non hendrerit tortor. Aliquam feugiat porta urna vel dignissim. Curabitur id malesuada lectus. Etiam in efficitur nisl. Etiam vitae faucibus nulla. Vestibulum posuere elit nisl viverra pretium in vel libero. Nam vel aliquet mauris, vel lobortis metus. Ut vehicula nunc tellus vulputate, vel euismod odio consequat.",

    # INSTRUCTIVE
    "Which do you want to guide you through a workout?":"Next, perform 20 bodyweight squats. Stand with your feet shoulder width apart with your feet facing forward. Bend at the knees, keeping your back straight. Lower your hips until they are level with your knees. Stand up and repeat.",

    "Which do you want to help you follow a recipe":"Preheat the oven to 350 degrees. While the oven is preheating, mash bananas until smooth. Mix in the melted butter. Mix together the beaten egg, sugar and vanilla. Add to the banana and butter mixture. Slowly mix in the flour and baking soda.",

    "Which do you want to give you directions?":"Your destination is 145 Queen Street. You will arrive in 14 minutes. In 200 meters, at the roundabout, take the second exit to remain on West Hill avenue. Continue straight for 2 kilometers.",

    # INFORMATIVE
    "Which do you want to deliver the weather forecast?":"It looks like it's going to be a gloomy day today. There is a 100% chance of showers until 1:00pm today. After that, it's overcast with a 60% chance of rain. The high is 10 degrees and the low is -1.",

    "Which do you want to get your meetings and appointments?":"You have three items on your schedule today. You have a marking meeting in DC3017 at 2:00pm, CS898 at 4:30pm and gym at 7:00pm.",

    "Which do you want to make suggestions for a restaurant?":"According to TripAdvisor, there are 4 restaurants rated over 4 stars in the nearby area. Neptune's Fish and Chips has 4.5 stars, Ye's Sushi has 4.8 stars, Rodeo House has 4.1 stars, and Everest Cafe and Bar as 4.7 stars.",
}

for name in "ABCDEF":
    voice = tts.TTS(name=name)
    if not os.path.exists(os.path.join('audio', name)):
        os.makedirs(os.path.join('audio', name))
    for filename in data:
        voice.speak(data[filename], outloud=False, filename=os.path.join('audio', name, filename))
