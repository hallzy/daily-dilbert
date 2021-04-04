[![paypal](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/donate?business=QMDXUKQXRT75N&currency_code=CAD)

# Daily Dilbert

This is a Google App Script (GAS) to retrieve today's Dilbert comic from their website
and email it to me as an inline image.

Yes, I recognize that GAS has a way to parse HTML using some XML library. So why
didn't I use it? Because it is very strict about syntax and frankly, the Dilbert
website wasn't able to be parsed.

## Usage

Just create a Google App Script file in your Google Drive, paste in the code
from the `dilber.gs` file and setup your triggers. (I have mine set to 8:00am
Pacific).

I am not sure when Dilbert comics are actually posted, but they seem to have a
tendency to be posted the night before in my timezone, so something earlier than
8:00am Pacific would likely also work.
