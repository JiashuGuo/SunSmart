// This #include statement was automatically added by the Particle IDE.
#include <Adafruit_VEML6070.h>

// This #include statement was automatically added by the Particle IDE.
#include <Adafruit_GPS.h>

#include <Wire.h>

// the name of the hardware serial port?
#define GPSSerial Serial1

// Set GPSECHO to 'false' to turn off echoing the GPS data to the Serial console
// Set to 'true' if you want to debug and listen to the raw GPS sentences
#define GPSECHO false

// Connect to the GPS on the hardware port
Adafruit_GPS GPS(&GPSSerial);
// connect to UV sensor
Adafruit_VEML6070 uv = Adafruit_VEML6070();

// get current time
uint32_t timer = millis();


void setup()
{
  //while (!Serial);  // uncomment to have the sketch wait until Serial is ready

  // connect at 115200 so we can read the GPS fast enough and echo without dropping chars
  Serial.begin(115200);
  Serial.println("SunSmart basic test!");

  // this integration VEML6070_1_T takes about 125ms to calculate the intensity
  uv.begin(VEML6070_1_T);

  // 9600 NMEA is the default baud rate for Adafruit MTK GPS's- some use 4800
  GPS.begin(9600);

  // uncomment this line to turn on RMC (recommended minimum) and GGA (fix data) including altitude
  GPS.sendCommand(PMTK_SET_NMEA_OUTPUT_RMCGGA);
  // uncomment this line to turn on only the "minimum recommended" data
  //GPS.sendCommand(PMTK_SET_NMEA_OUTPUT_RMCONLY);
  // For parsing data, we don't suggest using anything but either RMC only or RMC+GGA since
  // the parser doesn't care about other sentences at this time
  // Set the update rate
  GPS.sendCommand(PMTK_SET_NMEA_UPDATE_1HZ); // 1 Hz update rate
  // For the parsing code to work nicely and have time to sort thru the data, and
  // print it out we don't suggest using anything higher than 1 Hz

  // Request updates on antenna status, comment out to keep quiet
  GPS.sendCommand(PGCMD_ANTENNA);

  delay(1000);

  // Ask for firmware version
  GPSSerial.println(PMTK_Q_RELEASE);
}

void loop()
{
  // read data from the GPS in the 'main loop'
  char c = GPS.read();

  // if you want to debug, uncomment the following two lines!
  // if (GPSECHO)
  //   if (c) Serial.print(c);

  // if a sentence is received, we can check the checksum, parse it...
  if (GPS.newNMEAreceived()) {
    // a tricky thing here is if we print the NMEA sentence, or data
    // we end up not listening and catching other sentences!
    // so be very wary if using OUTPUT_ALLDATA and trytng to print out data
    // next, parse GPS data
    if (!GPS.parse(GPS.lastNMEA())) // this also sets the newNMEAreceived() flag to false
      return; // we can fail to parse a sentence in which case we should just wait for another
  }

  // if millis() or timer wraps around, we'll just reset it
  if (timer > millis())
  {
    timer = millis();
  }

  // approximately every 2 seconds or so, print out the current stats
  if (millis() - timer > 2000) {
    timer = millis(); // reset the timer
    Serial.println("");
    Serial.print("\nTime: ");
    Serial.print(GPS.hour, DEC); Serial.print(':');
    Serial.print(GPS.minute, DEC); Serial.print(':');
    Serial.print(GPS.seconds, DEC); Serial.print('.');
    Serial.println(GPS.milliseconds);
    Serial.print("Date: ");
    Serial.print(GPS.day, DEC); Serial.print('/');
    Serial.print(GPS.month, DEC); Serial.print("/20");
    Serial.println(GPS.year, DEC);
    Serial.print("UV_raw: ");
    Serial.println(uv.readUV());
    Serial.print("Fix: "); Serial.println((int)GPS.fix);

    // Serial.print(" quality: "); Serial.println((int)GPS.fixquality);
    if (GPS.fix) {
      Serial.print("Location: ");
      float temp_lalo = 0.0;
      int lalo_integer = 0;
      lalo_integer = int(GPS.latitude / 100);
      temp_lalo = lalo_integer + (GPS.latitude - lalo_integer * 100) / 60.0;
      Serial.print(temp_lalo, 6); Serial.print(GPS.lat);
      Serial.print(", ");
      lalo_integer = int(GPS.longitude / 100);
      temp_lalo = lalo_integer + (GPS.longitude - lalo_integer * 100) / 60.0;
      Serial.print(temp_lalo, 6); Serial.println(GPS.lon);
    }
    else {
      Serial.print("Location: ");
      Serial.print("NA");
      Serial.print(", ");
      Serial.print("NA");
    }
  }
}