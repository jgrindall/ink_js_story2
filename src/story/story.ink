VAR name = "John"

->start

== start ==

one one one one one one one one one one one one %choice% two two two two  %choice% fffffff %choice% ijiji


 + [Choice a] -> a
 + [Choice b] Hello -> q
 + [Choice c] Hello -> END
 



 * -> END
 
 == p ==
 This is p
 
 * [Choice ccc] -> start
 * [Choice ddd] Hello -> start
 
 == q ==
 This is q

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
 
 



