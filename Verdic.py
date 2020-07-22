import pyttsx3 
import sys

n = len(sys.argv) 
print(n)

  
# initialisation 
engine = pyttsx3.init() 
  
# testing 
engine.say(sys.argv[1] + " on Question " + sys.argv[2])
engine.runAndWait()