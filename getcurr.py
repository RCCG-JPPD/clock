import pyautogui
from time import sleep

def f():
    try:
        x , y = pyautogui.position()
        print(x,y)
    except:
        pass

while True:
    f()
    sleep(1)