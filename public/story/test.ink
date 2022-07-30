VAR name = "John"

->start

== start ==
a
a
a
a
a
a
a
a
a


 + [Keep going1] -> test1
 + [Keep going2] -> test2
 + [Keep going3] -> test3


== test1 ==
b
b
b
b
b
b


+ [end1] -> test2
+ [end2] -> test2
+ [end3] -> test3


== test2 ==
c
c
c
c
c
c
c



+ [end] -> test3
+ [end] -> test3
+ [end] -> test3



== test3 ==
d
d
d
d
d
d
d
d
d


+ [end] -> END
+ [end] -> END
+ [end] -> END

