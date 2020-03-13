from google.cloud import texttospeech
import pyaudio
import wave
import sys

class TTS:
    def __init__(self, name='A'):

        self.client = texttospeech.TextToSpeechClient()

        self.voice = texttospeech.types.VoiceSelectionParams(
            language_code='en-US',
            name=f'en-US-Wavenet-{name}')

        self.audio_config = texttospeech.types.AudioConfig(
            audio_encoding=texttospeech.enums.AudioEncoding.LINEAR16)

    def speak(self, text, outloud=True, filename='tmp'):
        synthesis_input = texttospeech.types.SynthesisInput(text=text)
        response = self.client.synthesize_speech(synthesis_input, self.voice, self.audio_config)

        with open(f'{filename}.wav', 'wb') as out:
            out.write(response.audio_content)
            out.write(b'')

        if outloud:
            wf = wave.open(f'{filename}.wav', 'rb')
            chunk = 1024
            p = pyaudio.PyAudio()
            stream = p.open(format =
                            p.get_format_from_width(wf.getsampwidth()),
                            channels = wf.getnchannels(),
                            rate = wf.getframerate(),
                            output = True)

            data = wf.readframes(chunk)

            while data != b'':
                stream.write(data)
                data = wf.readframes(chunk)

            stream.close()
            p.terminate()
