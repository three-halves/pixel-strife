# pixel-strife
A clone of [pixelsfighting](https://pixelsfighting.com/) designed for power users. Supports an arbitrary amount of pixel colors and board size.

## Install
Clone or download this repository and run `index.html` in your favorite js-enabled browser. You can also statically host this repository's files using your favorite web server.

## Usage
Simulation options are specified using URL Parameters. Parameters have no default values and must be specified for fully functional operation. Currently accepted parameters:

| Param Name    | Description |
| --------      | ------- |
| `teams`       | Amount of teams/colors that the simulation is initalized with. |
| `sizex`       | Width of the simulation board |
| `sizey`       | Height of the simulation board |
| `interval`    | Millisecond interval between simulation steps. |

### Example
The following URL initiates a simulation with 2 teams, a 125x125 pixel board, and a 2 millisecond delay between steps; Assuming the simulation is hosted on localhost port 5500:

`http://localhost:5500/?teams=2&sizex=125&sizey=125&interval=2` 

### Configuration Wizard
A GUI configuration wizard for setting simulation parameters is available in `config.html`
