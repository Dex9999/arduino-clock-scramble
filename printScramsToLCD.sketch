#include <Wire.h>
#include <hd44780.h>                       // main hd44780 header
#include <hd44780ioClass/hd44780_I2Cexp.h> // i2c expander i/o class header

// LCD geometry
const int LCD_COLS = 20;
const int LCD_ROWS = 4;


/*-----( Declare objects )-----*/
hd44780_I2Cexp lcd; // declare lcd object: auto locate & auto config expander chip  

int status;

void setup()
{
  Serial.begin(9600);
  lcd.begin(20,4);         // initialize the lcd for 20 chars 4 lines, turn on backlight

// ------- Quick 3 blinks of backlight  -------------
  for(int i = 0; i< 3; i++)
  {
    lcd.backlight();
    delay(250);
    lcd.noBacklight();
    delay(250);
  }
  lcd.backlight(); // finish with backlight on  

  // NOTE: Cursor Position: Lines and Characters start at 0  
  lcd.setCursor(0,0); //Start at character 1 on line 1
  lcd.print("It's clocking time!");
}

void loop() {
    // when characters arrive over the serial port...
    if (Serial.available()) {
      // wait a bit for the entire message to arrive
      delay(100);
      // clear the screen
      lcd.clear();
      // read all the available characters
      while (Serial.available() > 0) {
        // display each character to the LCD
        lcd.write(Serial.read());
      }
      // String message = Serial.readStringUntil('\n');
    }
  
}
