Run app with tracing

* Choose multiple trace categories
* X is `localhost` a domain or IP

```
-tracehost=X -trace=Log,Bookmark,Frame,CPU,GPU,LoadTime,File,Net
```

Create a traced section.

```
SCOPED_NAMED_EVENT(TickSyncing, FColor::Magenta);
TRACE_BEGIN_FRAME(TraceFrameType_Game);
...
TRACE_END_FRAME(TraceFrameType_Game);
```