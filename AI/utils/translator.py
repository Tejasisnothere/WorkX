import requests
import os
from logger import logging
from exception import CustomException
import sys
from dotenv import load_dotenv
load_dotenv()

TRANSLATION_API_KEY = os.getenv("TRANSLATION_API_KEY")




class Translator:
    def __init__(self, from_lang="hi", to_lang="en"):
        self.key = TRANSLATION_API_KEY
        self.url = "https://translation.googleapis.com/language/translate/v2"
        self.from_lang = from_lang
        self.to_lang = to_lang

    
    def translate(self, text):
        params = {
            "key":self.key
        }

        data = {
            "q":text,
            "target":"en",
            "format":"text"
        }

        try:

            logging.info("Translation request initiated")
            response = requests.post(self.url, params=params, json=data)

            print(response.json()['data']['translations'][0]['translatedText'])

            return response.json()['data']['translations'][0]['translatedText']


        except Exception as e:
            logging.info("ERROR")
            raise CustomException(e, sys)


    




