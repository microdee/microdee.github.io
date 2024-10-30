<!-- {
    "title": "Structured Exception Handling (SEH)",
    "desc": "Unix operating systems has signals, Windows has SEH. In characteristic Microsoft fashion there's a lot of peculiarities around that and this article collects some."
} -->

## Structured Exception Handling (SEH)
[(12.01.2024)](/c/log/seh)

Unix operating systems has signals, Windows has SEH. In characteristic Microsoft fashion there's a lot of peculiarities around that and this article ~~plagiarises~~ collects some.

### Notes from Unreal Engine:

The SEH mechanism is not very well documented, so to start with, few facts to know:

* SEH uses 'handlers' and 'filters'. They have different roles and are invoked at different state.
* Any unhandled exception is going to terminate the program whether it is a benign exception or a fatal one.
* Vectored exception handlers, Vectored continue handlers and the unhandled exception filter are global to the process.
* Exceptions occurring in a thread doesn't automatically halt other threads. Exception handling executes in thread where the exception fired. The other threads continue to run.
* Several threads can crash concurrently­.
* Not all exceptions are equal. Some exceptions can be handled doing nothing more than catching them and telling the code to continue (like some user defined exception), some needs to be handled in a `__except()` clause to allow the program to continue (like access violation) and others are fatal and can only be reported but not continued (like stack overflow).
* Not all machines are equal. Different exceptions may be fired on different machines for the same usage of the program. This seems especially true when using the OS 'open file' dialog where the user specific extensions to the Windows Explorer get loaded in the process.
* If an exception handler/filter triggers another exception, the new inner exception is handled recursively. If the code is not robust, it may retrigger that inner exception over and over. This eventually stops with a stack overflow, at which point the OS terminates the program and the original exception is lost.

Usually, when an exception occurs, Windows executes following steps (see below for unusual cases):
1. Invoke the vectored exception handlers registered with `AddVectoredExceptionHandler()`, if any.
    - In general, this is too soon to handle an exception because local structured exception handlers did not execute yet and many exceptions are handled there.
    - If a registered vectored exception handler returns `EXCEPTION_CONTINUE_EXECUTION`, the vectored continue handler(s), are invoked next (see number 4 below)
    - If a registered vectored exception handler returns `EXCEPTION_CONTINUE_SEARCH`, the OS skip this one and continue iterating the list of vectored exception handlers.
    - If a registered vectored exception handler returns `EXCEPTION_EXECUTE_HANDLER`, in my tests, this was equivalent to returning `EXCEPTION_CONTINUE_SEARCH`.
    - If no vectored exception handlers are registered or all registered one return `EXCEPTION_CONTINUE_SEARCH`, the structured exception handlers (`__try/__except`) are executed next.
    - At this stage, be careful when returning `EXCEPTION_CONTINUE_EXECUTION`. For example, continuing after an access violation would retrigger the exception immediatedly.
2. If the exception wasn't handled by a vectored exception handler, invoke the structured exception handlers (the `__try/__except` clauses)
    - That let the code manage exceptions more locally, for the Engine, we want that to run first.
    - When the filter expression in `__except(filterExpression) { block }` clause returns `EXCEPTION_EXECUTE_HANDLER`, the 'block' is executed, the code continue after the block. The exception is considered handled.
    - When the filter expression in `__except(filterExpression) { block }` clause returns `EXCEPTION_CONTINUE_EXECUTION`, the 'block' is not executed and vectored continue exceptions handlers (if any) gets called. (see number 4 below)
    - When the filter expression in `__except(filterExpression) { block }` clause returns `EXCEPTION_CONTINUE_SEARCH`, the 'block' is not executed and the search continue for the next `__try/__except` in the callstack.
    - If all unhandled exception filters within the call stack were executed and all of them returned returned `EXCEPTION_CONTINUE_SEARCH`, the unhandled exception filter is invoked. (see number 3 below)
    - The `__except { block }` allows the code to continue from most exceptions, even from an access violation because code resume after the except block, not at the point of the exception.
3. If the exception wasn't handled yet, the system calls the function registered with `SetUnhandedExceptionFilter()`. There is only one such function, the last to register override the previous one.
    - At that point, both vectored exception handlers and structured exception handlers have had a chance to handle the exception but did not.
    - If this function returns `EXCEPTION_CONTINUE_SEARCH` or `EXCEPTION_EXECUTE_HANDLER`, by default, the OS handler is invoked and the program is terminated.
    - If this function returns `EXCEPTION_CONTINUE_EXECUTION`, the vectored continue handlers are invoked (see number 4 below)
4. If a handler or a filter returned the `EXCEPTION_CONTINUE_EXECUTION`, the registered vectored continue handlers are invoked.
    - This is last chance to do something about an exception. The program was allowed to continue by a previous filter/handler, effectively ignoring the exception.
    - The handler can return `EXCEPTION_CONTINUE_SEARCH` to observe only. The OS will continue and invoke the next handler in the list.
    - The handler can short cut other continue handlers by returning `EXCEPTION_CONTINUE_EXECUTION` which resume the code immediatedly.
    - In my tests, if a vectored continue handler returns `EXCEPTION_EXECUTE_HANDLER`, this is equivalent to returning `EXCEPTION_CONTINUE_SEARCH`.
    - By default, if no handlers are registered or all registered handler(s) returned `EXCEPTION_CONTINUE_SEARCH`, the program resumes execution at the point of the exception.

Inside a Windows OS callback, in a 64-bit application, a different flow than the one described is used:

- 64-bit applications don't cross Kernel/user-mode easily. If the engine crash during a Kernel callback, `EngineUnhandledExceptionFilter()` is called directly. This behavior is documented by various article on the net.
  - See: https://stackoverflow.com/questions/11376795/why-cant-64-bit-windows-unwind-user-kernel-user-exceptions.
- On early versions of Windows 7, the kernel could swallow exceptions occurring in kernel callback just as if they never occurred. This is not the case anymore with Win 10.

Other SEH particularities:
- A stack buffer overflow bypasses SEH entirely and the application exits with code: `-1073740791 (STATUS_STACK_BUFFER_OVERRUN)`.
- A stack overflow exception occurs when not enough space remains to push what needs to be pushed, but it doesn't means it has no stack space left at all. The exception will be reported
if enough stack space is available to call/run SEH, otherwise, the app exits with code: `-1073741571 (STATUS_STACK_OVERFLOW)`
- Fast fail exceptions bypass SEH entirely and the application exits with code: `-1073740286 (STATUS_FAIL_FAST_EXCEPTION)` or `1653 (ERROR_FAIL_FAST_EXCEPTION)`
- Heap corruption (like a double free) is a special exception. It is likely only visible to Vectored Exception Handler (VEH) before possibly beeing handled by Windows Error Reporting (WER). A popup may be shown asking to debug or exit. The application may exit with code `-1073740940 (STATUS_HEAP_CORRUPTION)` or `255 (Abort)` depending on the situation.

The engine hooks itself in the unhandled exception filter. This is the best place to be as it runs after structured exception handlers and it can be easily overriden externally (because there can only be one) to do something else.

### Other resources

* See this article from 1997 [A Crash Course on the Depths of Win32™ Structured Exception Handling](https://web.archive.org/web/20180115191634/http://www.microsoft.com:80/msj/0197/exception/exception.aspx)

<mdcomment></mdcomment>