# pixel-strife
A clone of [pixelsfighting](https://pixelsfighting.com/) designed for power users. Supports an arbitrary amount of pixel colors and board size.

## Install
Clone or download this repository and run `index.html` in your favorite js-enabled browser. 
You can also statically host this repository's files using your favorite web server.

## Usage
Simulation options are specified using URL Parameters. 
Some parameters have no default values and must be specified for fully functional operation. Currently accepted parameters:

| Param Name    | Description | Required |
| --------      | ------- |   ------- |
| `teams`       | Amount of teams/colors that the simulation is initalized with | Yes |
| `sizex`       | Width of the simulation board | Yes |
| `sizey`       | Height of the simulation board | Yes |
| `reload`      | Amount of time to wait (in milliseconds) before reloading page after one team covers the board | No, will never reload if not given |
| `interval`    | Millisecond interval between simulation steps. | Yes |
| `initial`     | Base64 Image Data used to create an inital board state | No, will default to a vertically-striped board |
| `c[n]`        | Where [n] is any number 0-255. Forces team [n] to be the hex color specified in the parameter. (Requires leading `%23`) | No, will default to random colors |

### Examples
The following URL initiates a simulation with 2 teams, a 125x125 pixel board, and a 2 millisecond delay between steps; Assuming the simulation is hosted on localhost port 5500:

`http://localhost:5500/?teams=2&sizex=125&sizey=125&interval=2`

Another example which specifies colors and a initial board state:

`http://localhost:5500/index.html?teams=8&c0=%23000000&c1=%23eaf2e0&c2=%23ff5838&c3=%239bb2c7&c4=%23001a00&c5=%23aaff2d&c6=%230f3488&c7=%237cd279&sizex=28&sizey=30&interval=2&initial=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAMAAAAIG46tAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAYUExURery4P9YOJuyxwAaAKr%2FLQ80iHzSeQAAANjmOfwAAAAIdFJOU%2F%2F%2F%2F%2F%2F%2F%2F%2F8A3oO9WQAAAAlwSFlzAAAOwwAADsMBx2%2BoZAAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIDUuMS45bG7aPgAAALZlWElmSUkqAAgAAAAFABoBBQABAAAASgAAABsBBQABAAAAUgAAACgBAwABAAAAAgAAADEBAgAQAAAAWgAAAGmHBAABAAAAagAAAAAAAABgAAAAAQAAAGAAAAABAAAAUGFpbnQuTkVUIDUuMS45AAMAAJAHAAQAAAAwMjMwAaADAAEAAAABAAAABaAEAAEAAACUAAAAAAAAAAIAAQACAAQAAABSOTgAAgAHAAQAAAAwMTAwAAAAAEzPwEglj9egAAAAe0lEQVQ4T7XSSw6AIAwEUNpCe%2F8bm4HyMUYLC2dhkJeYOmmymnQLkd9%2BIr0kRjyI2CMeYM4xMpfC3MfBWcRMNUJV4PiPhLOIah0owHZxjmYik1ow0A6CkVmCF7%2BBCCgt7%2FvYPrjy34i1IkIBp4hl6Yt1ik%2FeQ298lB7iBcDDDdHJtAsSAAAAAElFTkSuQmCC`

### Configuration Wizard
A GUI configuration wizard for setting simulation parameters is available in `config.html`.
Notable features include simple color specification and parameter generation via image upload.
