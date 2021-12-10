# snake
Snake-Spiel zur Bewerbung als Anwendungsentwickler

Ein Webserver, der das Spiel hostet, kann aufgesetzt werden, indem serve.js über node.js ausgeführt wird.
serve.js stellt die beiden anderen Dateien index.html und snake.js bereit. index.html ist über den <script>-Tag mit dem Code in Snake.js verknüpft.
snake.js interagiert anschließend mit dem Canvas und dem Div der index.html.

PORT 1234
da ich nicht davon ausgehen kann, dass häufig verwendete Ports auf der Testmaschine frei sein, habe ich 1234 verwendet.

Farben: 
Grün = Schlange/Snake/Player
Blau = Essen/Food

Steuerung: W,A,S und D.
Das Spiel wird begonnen, indem eine dieser Tasten gedrückt wird.
Ist das Spiel beendet, muss die aufgerufene Website neu geladen werden, damit die nächste Runde begonnen werden kann.

Außerdem: Steuert man "rückwärts" in sich hinein, wird dies ebenfalls als "Schlange gefressen" gewertet. Dies könnte einfach verändert werden,
jedoch wollte ich den Code zunächst auf das Wesentliche beschränken,

- Pascal Siemer
