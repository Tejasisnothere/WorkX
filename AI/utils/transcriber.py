import os 
from groq import Groq
from dotenv import load_dotenv
from logger import logging
from exception import CustomException
import sys

load_dotenv()

AUDIO_STORAGE_PATH = os.path.join(os.getcwd(), "audios")


class Transcriber:
    def __init__(self, filename="voice.mp3"):
        self.filename = filename
        self.client = Groq()


    def transcribe(self):
        try:
            file_path = os.path.join(AUDIO_STORAGE_PATH, self.filename)
            with open(file_path, "rb") as file:

                
                transcription = self.client.audio.transcriptions.create(
                file=(file_path, file.read()),
                model="whisper-large-v3",
                temperature=0,
                response_format="verbose_json",
                )
                print(transcription.text)

                return transcription.text

        
        except Exception as e:
            CustomException(e, sys)




