VAR name = "John"

->start

== start ==

#{"background": "abc" }

\{"type":"image", "src": "download.png", "class":"banner"\}

#{"effects": ["slide-left"] }

One day something happened1

One day something happened2 One day something happened2One day something happened2One day something happened2One day something happened2One day something happened2One day something happened2One day something happened2 One day something happened2One day something happened2One day something happened2One day something happened2

\{"type":"image", "src": "a.png", "class":"center"\}

#{"effects": ["expand"] }

One day something happened3
One day something happened3

One day something happened3

\{"type":"image", "src": "a.png", "class":"center"\}

One day something happened3

One day something happened3

One day something happened3

 \{"type":"code", "file": "1.py"\}
 
 + [True] True -> donecode
 + [False] False -> donecode
 
 
 
 
 == donecode ==
 
 Great!

One day something happened3

One day something happened3

One day something happened3

One day something happened3

One day something happened3

One day something happened3

One day something happened3

 + [aaaa] aaaa -> choice
 + [bbbb] bbbb -> choice

== choice ==

One day something happened3

This is an inline choice %choice% you can click it

 + [Keep going] -> cont


== cont ==

Your car makes a strange noise and then stops.

BANG

A tyre has burst

#{"bg": 1 }

Luckily, you can see a house in the distance. You walk up to the front door

YOu can see a path heading around the house to the right, and a large wooden door.


\{"type":"image", "src": "download.png", "class":"banner"\}

YOu can see a path heading around the house to the right, and a large wooden door.

#{"bg": 2 }

You can  %choice% or if you decide to get dry as quickly as possible you can  %choice%. CHoose quickly!

 + [walk] -> a
 + [ring] Hello -> p
 

 * -> END
 
 == p ==
 This is p
 
 \{"type":"code", "file": "1.py"\}
 
 
 #{"bg": 3 }
 * [Choice ccc] -> start
 * [Choice ddd] Hello -> start
 
 == q ==
 This is q
 #{"bg": 4 }
 * [Choice eee] -> start
 * [Choice fff] Hello -> start
 
 
 
#{"effects": ["slide-left"] }

#{"effects": ["expand"] }

aaaaaaaaaaaaa


bbbbbbbbbbb
cccccccccccccccccccccccccccccc

#{"effects": ["expand"] }

dddddddddddddddddd



== carry_on ==

#{"effects": ["expand"], "delay": 3000 }
aaaaaaaaaaaaa
->END


== carry_on2 ==

ffffffffffffff

#{"delay": 3000}


 * [Choice a] -> a
 * [Choice b] Hello -> b 
 * And another -> c


== a ==
\{"type":"image", "src": "aaaa.png"\}

This is a
#{"delay": 3000}

This is also a

aaaaaaaaaaaaa

bbbbbbbbbbb

cccccccccccccccccccccccccccccc



 * [This goes to b] -> b
 * [To c] And another -> c
 * [This goes to b] -> b
 * [To c] And another -> c
 * [This goes to b] -> b
 * [To c] And another -> c


== b ==
This is b
This is also b

 * [Choice a] -> d
 * [Choice b] Hello -> d
 * And another -> d




== d ==
This is dd
This is also dd
-> e


== e ==
This is e
This is also e

 * [Choice a] -> end
 * [Choice b] Hello -> end
 * And another -> end






== c ==
This is c
This is also c
-> end



== end ==

- They lived happily ever after.
    -> END


=== function changeName(newName) ===
 ~ name = newName
 
 



