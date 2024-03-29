# testone-complexity-plugin




Use this plugin in [@fedeghe/testone](https://www.npmjs.com/package/@fedeghe/testone) to quickly get informations about  
**complexity** of the functions involved in the micro tests.

This plugin wraps [plato npm package](https://www.npmjs.com/package/plato) to get the complexity report informations.

``` js
const testone = require('@fedeghe/testone'),
    tcp = require('testone-complexity-plugin')

const pow1 = (a, b) => a ** b,
    pow2 = (a, b) => Math.pow(a, b),
    pow3 = (a, b, r = 1) => {
      while(b--) r *= a;
      return r;
    };

const benchmarks = [{
    in: [2, 10],
    out: 1024
}, {
    in: [2, 30],
    out: 1073741824
},{
    in: [2, 40],
    out: () => 2**40
}]
const strategies = [pow1, pow2, pow3];

// then in the the micro test options use
// the plugin and consume in metrics
testone(benchmarks, strategies, {
    plugins: [{
        fn: tcp,
        options: {}, // ***,
        skipReport: true, // by default is false
                         // if true instead result.pluginsResults
                         // will always include the full plugin
                         // output grouped by strategy
        resultsLabel: 'cmplx'

    }],
    metrics: {
        myMetric: ({pluginsResults, mem, time}) => {
            // consume time & memory basic info
            // AND all plugins full results to create your own
            // metric

            // every metric will be called passing all the plugins
            // results for each strategy, and all metrics will be
            // computed for each strategy and returned into
            // result.metrics
            return time.single * mem.single;
        },
        myComplexityInfo: ({
                pluginsResults: {
                    /**
                     * this `cmplx` corresponds to the resultsLabel specified value
                     * setting the plugin
                     * if not given one should use `complexity` (quite hidden) and not `tpc`
                     * thus the named `tcp` chosen importing it does not matter
                     **/
                    cmplx: { // it contains what the plugin returns
                        complexity: { 
                            methodAggregate:{
                                cyclomatic,
                                halstead: {
                                    difficulty
                                }
                            }
                        }
                    }
                },
                mem: {single: mem}
            }) => ({
                cyclomatic,
                difficulty,
                mem
            }),
    }
}).then(result => {
    console.log(result.metrics);
    /*
    // those values are just samples to show the result strucure
    // and are clearly not the actual output for the pow1 & pow2
    // u see above 
    {
        myComplexityInfo: {
            pow1: {
                cyclomatic: 2,
                difficulty: 15,
                mem: 2458.808
            },
            pow2: {
                ...
            },
            pow3: {
                ...
            }
        }
    }*/ 

    console.log(result.pluginsResults);
});

```

### *** plugins `options`
The plugin just call `plato.inspect` passing as options just `{}`  
Use `plugin.options` to set yours`  
See [plato](https://www.npmjs.com/package/plato) on npm to check the available options
