/**
 * What a number means, declared.
 *
 * Written as SQL, a number carries no statement of what it is: three sums of the
 * same column under three names are indistinguishable, so nothing downstream can
 * tell revenue from weighted revenue, and "show this monthly" has nothing to
 * rewrite. A measure declared here arrives knowing its own aggregation, unit and
 * gluing, which is what lets a request be rewritten, a caption be written, and an
 * illegitimate answer be refused before it is asked for.
 *
 * What is authored is what a person knows: a label, a unit, a gluing monoid, what
 * a dimension rolls up to, which source a key reaches. How large a domain is is
 * a `SourceProfile`, measured off the data, so that a declared width cannot drift
 * from the answer a query returns.
 *
 * A catalog is one source and the maps out of it. Fan-out and the chasm trap are
 * what those maps are for: a dimension one map away is pulled back through a key
 * this module can check is unique, and a chain of two is refused.
 */
import type { ColumnMeta } from "./contract";
import type { Extent, Quality, SourceProfile } from "./profile";
export type Aggregation = "sum" | "avg" | "count" | "count_distinct" | "min" | "max"
/** A quantile, which cannot be derived from quantiles of the parts. */
 | "p95";
/**
 * Whether a measure may be added up, and along which axes.
 *
 * The property that makes a grain change safe or wrong: a sum stays a sum at
 * any grain, an average of averages is not an average, and a balance may be
 * added across accounts but not across time.
 */
export type Additivity = "additive" | "semi_additive" | "non_additive";
/**
 * What to expect at a coordinate nothing was read at.
 *
 * A coordinate with no rows is not the same as a coordinate whose value is
 * zero, and the difference is a property of the measure: no deals closed in
 * March means the pipeline was nought, and no timings in March means the timer
 * was down, not that requests were infinitely fast. Declaring which lets one
 * mechanism serve both, and lets a chart say which one it drew.
 */
export type Prior = 
/** The empty set has a value and it is the identity: no rows, no money. */
"nothing"
/** A level persists until something changes it, so the last reading stands. */
 | "unchanged"
/** A quantity exists between its readings, so the gap is on the line. */
 | "between"
/** Nothing is known, and the honest value is no value. */
 | "unknown";
/**
 * The prior a measure fills by, declared or derived.
 *
 * Derived where it can be, because most of the time the aggregation already
 * says it. `sum` and the counts have an identity on the empty set and it is
 * nought; nothing else does, so nothing else may invent one. What cannot be
 * derived is whether the quantity persists or interpolates between readings —
 * that is about the world and not about the arithmetic — so it is declared.
 */
export declare function priorOf(measure: MeasureDef): Prior;
export type TimeGrain = "day" | "week" | "month" | "quarter" | "year";
export declare const TIME_GRAINS: readonly TimeGrain[];
/**
 * A number the catalog can produce, of which there are two kinds.
 *
 * The split is where the division happens. A term divides two values in a row;
 * a rate divides two aggregates, and no term can say that because a term is
 * evaluated before the grouping. Win rate is `sum(won) / sum(pipeline)` and
 * average deal size is `avg(amount_usd)`: they differ by the level the operator
 * appears at.
 */
export type MeasureDef = Aggregated | Rate;
export interface Aggregated {
    readonly name: string;
    readonly label: string;
    readonly expr: Expr;
    readonly agg: Aggregation;
    /**
     * Whether the parts of this add up to the whole, across the places holding them.
     *
     * All a catalog can declare, and less than `Additivity` has to say: a stock adds
     * across offices and not across quarters, and which axis that is cannot be spelled
     * by a flag — `level` spells it, and `additivityOf` reads the two together. Named
     * apart from `additivity` so that a reader wanting the answer and reaching for the
     * declaration does not compile.
     */
    readonly adds: boolean;
    /** What to expect where nothing was read. Derived from `agg` when unsaid. */
    readonly prior?: Prior;
    /**
     * A level, and what it is a level of.
     *
     * Units on hand and headcount are read at a moment and add across the places
     * holding them, so a period is one reading and not a sum of its days. Saying so
     * takes two names: the clock the reading is dated by, and the dimensions one
     * series is kept per. Neither is derivable — a request's coordinates are what
     * somebody asked for, and the grain of a snapshot is a fact about the source.
     *
     * A measure with this is semi-additive: the flag would say a stock does not add
     * along time without saying along what, and there is nothing to compute from a
     * refusal.
     */
    readonly level?: Level;
}
/** What a stock is a stock of: dated by `asof`, one per `per`. */
export interface Level {
    /** The time dimension the reading is dated by, by name. */
    readonly asof: string;
    /** The dimensions one series is kept per, by name. */
    readonly per: readonly string[];
}
/**
 * One measure over another, both aggregated first.
 *
 * Everything about it is derived, which is the point: its unit is the two
 * units divided, and it is never additive, because adding two rates is the
 * defect the whole additivity machinery exists to refuse. Declaring either
 * would be declaring something already known, and one fact declared twice is
 * one that can disagree with itself.
 */
export interface Rate {
    readonly name: string;
    readonly label: string;
    /** The measures over and under, by name, from this same catalog. */
    readonly per: readonly [string, string];
}
/** The columns a measure reads, through a rate to the measures under it. */
export declare function readsOf(catalog: Declaration<unknown>, measure: MeasureDef): readonly string[];
/** How a measure reads as an expression, for a reader. */
export declare function describes(catalog: Declaration<unknown>, measure: MeasureDef): string;
/** How a measure combines its rows, where it aggregates rows at all. */
export declare function aggOf(measure: MeasureDef): Aggregation | undefined;
/**
 * Whether a measure may be added across a cut, and the only place that answers it.
 *
 * Three sources, none of which is a field: a rate is non-additive because a quotient
 * of aggregates is not an aggregate of quotients, a level is semi-additive because it
 * adds across places and not across time, and everything else is what it declared.
 */
export declare function additivityOf(measure: MeasureDef): Additivity;
/** What a measure is a level of, or null where it is a flow. */
export declare function levelOf(measure: MeasureDef): Level | null;
/**
 * How an aggregate's parts recombine into its whole.
 *
 * Derived from the aggregation: it is a fact about the function. `additivity`
 * was two claims wearing one name: that these *values* may not be added, and
 * that these *coordinates* cannot be composed. The first is true of a mean and
 * the second is not — a mean of means is wrong, and a mean is still recoverable
 * from the means and counts of its parts. Only the first is a judgement, and it
 * stays declared.
 *
 * `null` where there is no finite sufficient statistic. A quantile and a distinct
 * count are impossible to compose: recovering them needs the distribution or the
 * set, and no fixed number of columns carries either. A sketch would buy an
 * approximation, and a figure that says p95 must not quietly mean about p95.
 */
export type Gluing = {
    readonly by: "sum";
} | {
    readonly by: "min";
} | {
    readonly by: "max";
}
/**
 * A quotient of two things that do add: carry both, divide at the end.
 *
 * A mean and a declared rate are the same construction, which is why they glue
 * the same way and differ only in where the two sides come from. A mean's
 * denominator is its reading count, and every answer carries that already; a
 * rate's are two measures of its own, and it holds only their quotient, so they
 * have to be carried beside it.
 *
 * Either way an empty coordinate contributes the identity without being
 * special-cased. Filtering the empty parts out by hand gets the same number and
 * is the sign a monoid was being simulated.
 */
 | {
    readonly by: "quotient";
    readonly of: "readings" | "sides";
}
/**
 * A level: the reading at the latest position, then added across the rest.
 *
 * Two operators, which is what makes this its own gluing and not
 * a `sum`: along the clock a level is an argmax, and along everything holding it
 * a level is a sum. `max` is neither — a warehouse that drew down from 50 to 42
 * holds 42, and the largest reading is a different question.
 *
 * Which clock is not here, because the measure declares it. A level recombines
 * from the source it was read at, and every coarsening recompiles, so the
 * position never has to survive an answer the way a quotient's sides do.
 */
 | {
    readonly by: "level";
} | null;
export declare function gluingOf(catalog: Catalog, measure: MeasureDef): Gluing;
/**
 * What a measure is computed from, as a term.
 *
 * The unit was declared beside the expression and the two could disagree, and
 * they did: `headcount` was `people` at the column and `{ person: 1 }` at the
 * measure, `years_open` was `years` against `{ year: 1 }`. A declaration that
 * can contradict another declaration of the same fact is `R57`'s shape, and
 * there the data could be asked. A unit is not in the data, so the only way to
 * stop the two from disagreeing is to stop saying it twice: the column carries
 * the unit, and the measure's unit is read off the term.
 *
 * Small. This is not SQL, it is the four shapes twelve measures
 * actually use, and it exists so that `unitOf` and `columnsRead` are folds over
 * a structure instead of arithmetic guessed from text and a regular expression
 * run over it.
 */
export type Expr = 
/** `count(*)`: the rows themselves, which have no unit. */
{
    readonly rows: true;
} | {
    readonly col: string;
} | {
    readonly times: readonly [Expr, Expr];
} | {
    readonly ratio: readonly [Expr, Expr];
}
/** The expression where a column takes a value, and null elsewhere. */
 | {
    readonly when: readonly [string, string];
    readonly then: Expr;
}
/**
 * A column of a source these rows map into, divided among the rows sharing it.
 *
 * The one honest way to cut a parent's quantity by a child's dimension. An
 * order has no single category, so its revenue cannot be reported by category
 * — but its revenue can be *divided* among its lines, and each line has one
 * category. Measured against the fixture, dividing by the size of the order's
 * fibre is the only rescaling under which the total survives: joining first
 * gives 600 and deduplicating the pairs first gives 500 where the truth is
 * 400.
 *
 * So this is not one option among several defensible allocations, it is what
 * makes the question answerable at all, and the measure it defines is a
 * different measure from the one it divides. `revenue` and `revenue allocated
 * across lines` are different quantities and a figure that shows one while
 * saying the other is the failure this catalog exists to prevent — which is
 * why an allocation is named and declared when a
 * cut would otherwise be refused.
 */
 | {
    readonly allocated: {
        readonly from: string;
        readonly column: string;
        /**
         * A column of *this* source weighting the division, where the parts are unequal.
         *
         * Equal division is the answer when nothing distinguishes the rows sharing a
         * parent, and a line of an order is that case. A neighbour is not: a ticket
         * six tenths one product and five tenths another is more the first, and
         * splitting its refund down the middle asserts a thing the similarity denies.
         *
         * So the share is the weight over the fibre's weights, which reduces to the
         * count when they are all one — and a weight nobody recorded *is* one, so a
         * row with no neighbour is its own whole fibre and carries its parent's
         * quantity intact into the nameless coordinate. Which is the property this
         * has to have: the total is the parent's total or the difference is visible
         * as a coordinate, never as a smaller number.
         */
        readonly by?: string;
    };
};
/** A term as an expression the engine will evaluate. */
/** Where an allocated column is read from, and where its divisor is. */
export declare const pulledFrom: (source: string) => string;
/**
 * What a pulled column is called once it has arrived.
 *
 * Scoped to the source it came from, because two parents may hold a column of the
 * same name and an unqualified reference to one of them is then ambiguous. Not
 * exotic: it is what a self edge is, both of whose ends are the one node table.
 * Renaming here rather than qualifying at each reference keeps every reader — the
 * cut, the filter, the ranking, the generated domain — writing one name that means
 * one column, which is what let them share a spelling in the first place.
 */
export declare const pulledAs: (source: string, column: string) => string;
export declare const sharedBy: (source: string, by?: string) => string;
/** The key both of those join on, and the count of rows sharing one. */
export declare const PULL_KEY = "_key";
export declare const SHARE = "_n";
/**
 * What a row's weight is worth, which is one where nobody recorded it.
 *
 * Written in the numerator and in the fibre's total by the same function, because a
 * share that read the two differently would not sum to one. One as the default is
 * what makes a weighted allocation over unrecorded weights the equal division it
 * replaces, rather than a division by nothing.
 */
export declare const weight: (column: string) => string;
export declare function sqlOf(expr: Expr): string;
/** The columns a term reads, structurally. */
export declare function columnsOf(expr: Expr): readonly string[];
/** The unit of a term, from the units of the columns it reads. */
export declare function unitOfExpr(catalog: Catalog, expr: Expr): Unit;
/**
 * What a measure is measured in, derived and never declared.
 *
 * Counting is the one aggregation that discards the unit of what it counts:
 * the number of deals is a number whatever a deal is worth. Everything else
 * here — sum, average, min, max, a percentile — reports a value drawn from the
 * same scale as its input, so it keeps the term's unit.
 */
export declare function unitsOf(catalog: Catalog, name: string): Unit;
export declare function unitOf(catalog: Catalog, measure: MeasureDef): Unit;
/**
 * Where a place's two readings are, and the frame that makes them mean something.
 *
 * `crs` is not decoration and is not derivable: 37.4 and -122.1 are a pair of numbers
 * until something says which sphere and which projection, and a cell is a rectangle in
 * *some* frame — equal in degrees under `EPSG:4326`, and so not equal in area, which is
 * a property a reader of a map will read off it whether or not anybody declared it. The
 * compiler treats a cell as a coordinate and needs no frame to group by one, so the only
 * consumer this could have is whatever turns a cell into a position — and today nothing
 * does: `Axis` does not carry it and `Cells` plots degrees straight. Declared and unread,
 * which is the state a frame has to be in before it can be read.
 */
export interface Place {
    /** The column holding the northing: latitude, under a geographic frame. */
    readonly north: string;
    /** The column holding the easting: longitude, under a geographic frame. */
    readonly east: string;
    /** The frame both are read in, as an authority names it. */
    readonly crs: string;
}
export interface DimensionDef {
    readonly name: string;
    readonly label: string;
    readonly column: string;
    /**
     * The dimension containing this one: city to metro, metro to country.
     *
     * Declared for the same reason time grains are ordered. Without it the only
     * way to make a split smaller is to delete it, so sixty sites that will not
     * fit become one number instead of four regions — and a coarser answer to
     * "where" is still an answer, where dropping the question is not.
     */
    readonly rollsUpTo?: string;
    /**
     * A clock, cuttable at a granularity.
     *
     * One kind of thing in the catalog: not two. A time dimension differs
     * from a categorical one in where its hierarchy comes from — an ordered list
     * of grains instead of a chain of containing columns — and in nothing else,
     * so the sizing, the rolling up, and the refusals are all one code path.
     *
     * It stays a separate coordinate in a *request*, which is a different claim
     * and the reason a broad edit can say "by month" without also dictating what
     * a chart is split by.
     */
    readonly time?: boolean;
    /**
     * A quantity: filterable, not splittable.
     *
     * Deal size is the third kind of thing a request may point at. It is not a
     * measure, because nothing aggregates it here, and it is not a category,
     * because splitting by it makes one group per distinct amount. Leaving it
     * out of the catalog is what forced filters to be opaque SQL, since the one
     * control the page offers that the catalog could not name had to be smuggled
     * past it. Binning is what would make it splittable, and there is no binning.
     */
    readonly continuous?: boolean;
    /**
     * A position on a plane.
     *
     * The fourth kind of thing a request may point at, and the one the catalog could
     * not name: latitude and longitude declared as measures, so the only question a
     * page could ask about them was their average — a point in the sea off Portugal.
     * They are not measures and they are not two quantities either, because neither
     * one alone indexes anything and a request that split by both would be asking for
     * a grid by accident.
     *
     * So a place is one dimension whose coordinate is a *cell*, which is what makes it
     * splittable at all: a group per distinct position is a group per site, the same
     * refusal a clock and a quantity get, and a cell is a place's grain. That the cells
     * come from a quotient of the plane of a line is the whole of what is
     * new here — a coordinate stays one value, `members` counts cells, and coarsening
     * one is climbing the same ladder a band climbs.
     *
     * `column` names the coordinate, because a cell is computed
     * from both columns and is in neither.
     */
    readonly place?: Place;
    /**
     * The members in the order they belong in, for a dimension that has one.
     *
     * The difference between a category and a stage. Discovery, evaluation,
     * negotiation, closed is a sequence, and every renderer here sorted it by
     * size — so the funnel arrived shuffled, in an order that changed whenever
     * the numbers did, and the one thing a funnel is for was the one thing it
     * could not show.
     *
     * Members, because a renderer asked to lay them out
     * needs to know *which* order and cannot be told merely that one exists.
     * Absent for the rest: most categories genuinely have no order, and
     * ranking them by their reading is then the informative thing to do.
     */
    readonly order?: readonly string[];
    /**
     * Where the set this column maps into is enumerated, when it is anywhere.
     *
     * Without this a dimension is a name and a column, and its members are read
     * off the fact with `SELECT DISTINCT` — so the index set is a function of the
     * data it indexes. The cost is exact and it is not about tidiness: a member
     * with no rows is then indistinguishable from a member that does not exist,
     * so a split by region cannot tell a region that sold nothing from one that
     * was never a region, and filling cannot be right in the case that decides a
     * total.
     *
     * A reference, because which object a column lands in is
     * a judgement and what the object contains is data. Declaring the members
     * here would put a copy of a table in the catalog and would not survive the
     * first dimension with more members than a page of code.
     *
     * Absent means the fact is the only witness, which is the honest reading of
     * a source nobody has said anything else about.
     */
    readonly extent?: {
        /** The relation enumerating the set, as the engine knows it. */
        readonly source: string;
        /** The column in it holding the members. */
        readonly column: string;
        /**
         * The coarser columns it also names: this source's column, to its own.
         *
         * An extent is a set of *tuples* wherever two cuts determine one another,
         * because those range over the pairs that occur and never their product,
         * and no pair of member lists supplies them: `cities` and `regions`
         * separately cannot say that Toronto is not in APAC. Declaring the coarser
         * column beside the finer one is what a dimension table already looks like,
         * and it is the only shape the pairs can be read from.
         *
         * Keyed by column because that is what reads it: a
         * domain is written against this source's column names, and a climbed
         * comparison carries its parent as a column and not as a cut at all.
         */
        readonly beside?: Readonly<Record<string, string>>;
    };
}
/**
 * What a coordinate is, which decides everything a renderer does with it.
 *
 * The grammar's half of the vocabulary, and it was missing. `Shape` counted
 * axes — one, two, or none — and a count cannot tell a clock from a category,
 * so `series` and `breakdown` were doing this job for the single-axis case and
 * `compound` was doing it for two axes by declining to. A line chart accepted
 * any compound, which is how it came to draw lines between accounts.
 *
 * Derived from the catalog: a dimension already
 * says whether it is a clock, whether it is continuous, and whether its members
 * are ordered, and those three facts are what a kind is.
 */
export type Kind = (typeof KINDS)[number];
/**
 * Every kind there is, so a place needing all of them does not list four.
 *
 * The list is what makes exhaustiveness checkable: a
 * renderer that accepts everything says so, and the corpus's coverage of kinds
 * is read from here.
 */
export declare const KINDS: readonly ["temporal", "ordinal", "nominal", "quantitative", "geo"];
export declare function kindOf(catalog: Declaration<unknown>, dimension: string): Kind;
/**
 * A source's rows landing in another source, which is a function and not a join.
 *
 * Every line has exactly one order, so `order_lines → orders` is a map; no order
 * has one line, so there is nothing in the other direction to declare. That
 * asymmetry is the whole content of a relationship, which is why no cardinality
 * is stated here. A map from rows to a key is many-to-one by construction, and
 * whether it happens to be injective is a property of the data — measurable
 * against the key, not declarable beside it.
 *
 * @typeParam To - what the far end is: its source name as a person wrote it, or the
 * measured {@link Catalog} once something has measured it. A map is authored before the
 * source at the other end has been read, and every *reader* of one needs it read, so the
 * two ends of that are different types and the resolution between them is a step.
 */
export interface Mapping<To = Catalog> {
    /**
     * The source each of these rows lands in, measured.
     *
     * A catalog and not a declaration, though a route is only composition of maps between
     * keys: a pull is many-to-one exactly when it lands on a key, and whether the far
     * column is one is a count over the far source. So a cut across a map needs that
     * source measured, and `keyed` refuses.
     */
    readonly to: To;
    /** The column here holding that source's key. */
    readonly by: string;
}
export interface ColumnDef {
    readonly role: ColumnMeta["role"];
    readonly label: string;
    readonly unit?: Unit;
}
/**
 * What a person declares about a source, which is everything except what is measured.
 *
 * Separate from {@link Catalog} because the two are produced by different things and one of
 * them can be wrong in a way the other cannot: a declaration is authored and reviewed, and
 * a profile is read off the bytes and is stale the moment they change. Naming the halves is
 * what makes the dependency legible — `profiling` takes a declaration, and a `Catalog` is
 * the answer, so measuring a source you must already have measured is no longer a sentence
 * this system can say.
 *
 * @typeParam To - what a map points at, which is the one field that changes across that
 * boundary. Held as a name here and as a measured `Catalog` on a `Catalog`, because a map
 * whose far end were measured would put a measurement inside the authored half and make
 * the sentence above false: nobody can write down a profile of the source next door, and a
 * declaration that transitively carried one would go stale without being edited.
 *
 * A function that does not follow maps takes `Declaration<unknown>` and so takes either,
 * which is the whole of what such a function knows. Following one needs it resolved, so
 * `routeTo` and everything over it take a `Catalog`.
 */
export interface Declaration<To = string> {
    /**
     * The bound source name, as `registerSource` knows it.
     *
     * Which is the id of a binding in the app's manifest, and the only thing a catalog
     * needs in order to name one: where the bytes are is the manifest's to say, and a
     * catalog that carried a URL too was a second answer to it — one that let this
     * example bind its own sources and so never exercise the path a real app takes.
     */
    readonly source: string;
    /**
     * What each column is, including the unit its numbers are on.
     *
     * The platform's `ColumnMeta` spells a unit as a string and the catalog
     * reasons over vectors, so this is the declaration and `columns` is
     * generated from it. Two spellings of one fact, with one of them derived.
     */
    readonly of: Readonly<Record<string, ColumnDef>>;
    readonly entity: string;
    readonly key: string;
    /**
     * The sources these rows map into, if any.
     *
     * What makes a cut on another source's dimension answerable, and what makes
     * the reverse refusable. A line may be cut by its order's region, because
     * composing two functions gives a function; an order may not be cut by a
     * line's category, because that map runs the other way and has no inverse.
     */
    readonly into?: readonly Mapping<To>[];
    /**
     * The region over which this source's silence means nought, by clock column.
     *
     * A prior fills a coordinate the rows never reached, and whether nought is the
     * right fill turns on a question the rows cannot answer: does their absence
     * mean the thing did not happen, or that nobody was watching? For a category
     * the first always holds — every order has a size, so no orders of a size is
     * nought of them, and that needs no declaration. For a clock it does not: a
     * table of orders ending on the fifth may mean the sixth was quiet or may mean
     * the load stops there, and `min` and `max` cannot tell those apart.
     *
     * So the span is declared and the fill obeys it. Inside, a sum reads nought,
     * because it was looked for. Outside, every prior says nothing, because a
     * nought there is a claim about a day nobody covered — and an `unchanged`
     * would carry the last known level to the end of whatever index set the
     * request happened to range over.
     *
     * Absent means the rows are the only witness of their own span, which is what
     * this did before the declaration existed. That is the reading that quietly
     * turns a stopped pipeline into a month of zeroes, so it is worth declaring.
     */
    readonly covers?: Readonly<Record<string, {
        readonly from: string;
        readonly to: string;
    }>>;
    readonly dimensions: readonly DimensionDef[];
    readonly measures: readonly MeasureDef[];
}
/** A declaration with the source measured, which is what every reader here takes. */
export interface Catalog extends Declaration<Catalog> {
    /**
     * What each column is, as the platform spells it: generated from `of` by
     * `catalogued`, because a unit declared twice is a unit that can disagree.
     */
    readonly columns: Readonly<Record<string, ColumnMeta>>;
    /**
     * How large this source's domains are, measured off the source itself.
     *
     * Held here, so that a catalog carries
     * everything a page needs to decide what will fit, and so that a test can ask
     * what `fit` does at a size by handing it one. A width reached for through a
     * module-level table is a width no law can quantify over.
     */
    readonly profile: SourceProfile;
    /**
     * How well an extractor filled this source's index, where anything has measured it.
     *
     * Absent for a source nobody extracted, which is most of them, and absent for an
     * extracted one before an evaluation run has read a gold set — those are the same state
     * and they mean the same thing: nothing here can say how many members the index is
     * missing, so a count over it is the count of what was placed and nothing more.
     */
    readonly quality?: Quality;
}
/**
 * What a dimension's pieces are laid over, or null where any of it went unmeasured.
 *
 * One extent for a quantity and two for a place, which is the only thing the ladder needs
 * to know about the difference. Null, because half
 * a plane is a line: a place whose easting nobody profiled would otherwise get a ladder
 * priced as though its cells ran in a row.
 *
 * Beside `dimensionNamed`, where it was, because three readers wanted
 * it and two of them wrote it again: `corpus.ts` inline and the example's dataset tab. Both
 * copies dropped the null, so both would price half a plane as a row of cells.
 */
export declare function spansOf(catalog: Catalog, dimension: string): readonly Extent[] | null;
export declare function dimensionNamed(catalog: Declaration<unknown>, name: string): DimensionDef | undefined;
/**
 * The dimensions containing this one, narrowest first: city, then metro, then country.
 *
 * The transitive closure of `rollsUpTo` and nothing else, because a roll-up is climbable
 * exactly where it is declared. Nesting that happens to hold in the data is not a
 * hierarchy — every column of a fact nests inside its key — and the two readers that want
 * this both suffer for the difference: `fit` would offer a rung nobody meant, and the
 * profiler would spend a query measuring it.
 *
 * Bounded, so a catalog declaring a cycle yields a short chain, not hanging the
 * page reading it.
 */
export declare function containing(catalog: Declaration<unknown>, dimension: string): readonly string[];
/**
 * Every chain of sources a measure here can be carried through to reach a cut.
 *
 * Composition, and the reason a relationship needs no cardinality: each step is
 * a map from rows to a key, so any chain of them is again a function and the cut
 * is well defined at the end of it. The absence of a route is the interesting
 * answer — it is not a missing join that someone could write by hand, it is the
 * statement that the quantity asked for does not exist. An order has no single
 * category, so no query answers what an order's category is.
 *
 * Every route rather than one, because two maps can reach one cut — two keys into
 * the same table, or two resolutions of the same pair of types — and they are two
 * different questions with two different answers. Each route stops at the nearest
 * source declaring the dimension, so a route is as short as it can be.
 *
 * `via` keeps only the routes traversing every map it names, by the column that
 * map reads. A `Mapping` carries no name of its own, so that column is its
 * identity, and it stays that identity when the model gains another map.
 */
export declare function routesTo(from: Catalog, dimension: string, via?: readonly string[]): readonly Route[];
/** A cut a source can be split by, and how many ways it is reached. */
export interface Askable {
    readonly dimension: string;
    /** The source declaring it, which is this one where the cut is its own. */
    readonly owner: string;
    /**
     * What sort of coordinate it is, which is also *how* it is asked for.
     *
     * A clock is asked over and everything else is asked by, and a list that did not
     * say which would be answering the question wrongly for exactly the cuts a reader
     * most often wants — the ones a figure has an axis for.
     */
    readonly kind: Kind;
    /**
     * How many chains of maps reach it, which is one for most and the question for the rest.
     *
     * Several is not an error and not a coincidence: two keys into one table are two
     * questions, and an unpinned request answers each of them. What it is *not* is a
     * number a reader should have to discover by getting two answers.
     */
    readonly routes: number;
}
/** A cut the model declares that no chain of maps carries a measure to. */
export interface Unreachable {
    readonly dimension: string;
    readonly owner: string;
}
/**
 * Every cut a source can be split by, and every cut it cannot, said once.
 *
 * The answer to *"what can I ask?"*, which is the catalog tool's whole job and was
 * being answered a type at a time. Enumerated rather than tried: the map graph is
 * finite and small — an ontology is a dozen types — so the reachable set is computed
 * once and is the same set `compile` accepts, which is what stops the promise and the
 * behaviour drifting apart.
 *
 * An unreachable cut is the interesting half and is why this returns both. It is not
 * a join somebody forgot to write, it is the statement that the quantity does not
 * exist: an order has no single category, so no query answers what an order's
 * category is, and what a reader needs is the name of the map that would have to
 * exist rather than an empty result they will read as *no data*.
 *
 * Only what the model holds. A walk nobody materialized declares no source, so it
 * cannot appear here however plausible the composition — buildable and askable are
 * different lists, and this is the second.
 */
export declare function routeSpace(model: readonly Catalog[], from: Catalog): {
    readonly askable: readonly Askable[];
    readonly unreachable: readonly Unreachable[];
};
/** A chain of maps carrying a measure from one source to a cut on another. */
export interface Route {
    /** The sources it passes through, the one holding the measure first. */
    readonly through: readonly Catalog[];
    /** The column each map along it reads, one shorter than `through`. */
    readonly via: readonly string[];
}
/** The source declaring the cut a route reaches. */
export declare function endOf(route: Route): Catalog | undefined;
/**
 * Whether knowing `by` leaves no choice about `of`.
 *
 * The relation the algebra was missing. Every cut was priced and enumerated as
 * though the cuts were independent, so a request split by city and by region
 * claimed sixty-four coordinates where sixteen exist, and one split by the
 * entity key claimed the key times every attribute of it — which is why asking
 * for rows looked like a carrier the algebra did not have. It is not a new
 * carrier. **Detail is a cut at the key**, and what was missing was the fact
 * that a key fixes everything else about its row.
 *
 * A truncated cut determines nothing: its residual is one coordinate holding
 * members from every parent, so `Other` does not sit in a single region.
 */
export declare function determines(catalog: Catalog, by: string, of: string): boolean;
/**
 * Where a cut's members are declared, as against read off the rows that use them.
 *
 * Two carriers for one claim. A relation holds the members of a set too large to
 * write down, and `order` holds the members of one small enough that writing them
 * down is how it was declared — five stages, two flags. Both say the index set is a
 * fact about the world rather than about the fact table, which is the only thing
 * anything downstream asks of either.
 */
export type Enumeration = NonNullable<DimensionDef["extent"]> | {
    readonly members: readonly string[];
};
/** Whichever of the two says what this dimension's members are, where either does. */
export declare function enumerating(dimension: DimensionDef | undefined): Enumeration | undefined;
/**
 * A dimension a request against this source can name, and the source holding it.
 *
 * `dimensionNamed` is this source's own columns, which is what a catalog reads
 * about itself. This is what a *request* can say, which is wider by every map the
 * catalog declares — and the difference is where the wrong answers were: a reader
 * asking the narrow question and meaning the wide one finds nothing and treats
 * that as a fact about the world.
 *
 * Nothing when several maps reach the name, since there is then no single owner
 * to answer for it and `compile` is where that choice is put to the caller.
 */
export declare function holding(catalog: Catalog, name: string): {
    readonly dimension: DimensionDef;
    readonly owner: Catalog;
} | undefined;
/**
 * What a reading is denominated in, as exponents over base quantities.
 *
 * `{ USD: 1 }` is money, `{ person: 1 }` a headcount, `{}` a pure number, and
 * `{ USD: 1, person: -1 }` is dollars per head. A string could name the first
 * three and could not derive the fourth, and could not decide anything: `"USD"`
 * and `"usd"` are two units, `"USD"` and a count are two units in exactly the
 * same way, and nothing about a string says that only one of those pairs is a
 * mistake. Exponents make **sharing a scale decidable** — the vectors are equal
 * or they are not — and they make a derived unit nameable without a table of
 * every combination anyone might write.
 *
 * A currency is a base quantity, so USD and EUR
 * do not share a scale. That is not conservatism: without a rate they cannot,
 * and the rate belongs to the frame a reading was taken in. Milliseconds and
 * years are separate for the same reason and with less excuse — see `R60`.
 */
export type Unit = Readonly<Record<string, number>>;
/**
 * A pure number, with nothing having cancelled to make it one.
 *
 * Not the same as a dimensionless *group*. `e` is this; a Reynolds number is
 * mass, length and time each cancelling to zero, and the two are both plain
 * numbers and are not the same thing. A group remembers what it is a ratio of,
 * so keep the zero exponents — `{ USD: 0 }` is dollars over dollars — and only
 * drop them where a name is being written.
 */
export declare const DIMENSIONLESS: Unit;
/**
 * The base quantities that cancelled, which is what makes a group a group.
 *
 * Empty for a count and for `e`. `["USD"]` for a win rate, which is dollars
 * won over dollars in play. Two numbers can be commensurable — both are pure
 * numbers and share an axis happily — and still be worth telling apart, which
 * is the whole use of dimensional analysis on a quantity that has no dimension.
 */
export declare function cancelled(unit: Unit): readonly string[];
/** Whether two readings can share an axis, which is whether they are the same quantity. */
export declare function commensurable(left: Unit, right: Unit): boolean;
/**
 * How to write it beside a number, or nothing when there is nothing to say.
 *
 * The one boundary between the vector and every consumer that wants a word:
 * the platform's `formatCell` reads a unit as a string, and so does a reader.
 */
export declare function spell(unit: Unit): string | undefined;
/** Enough of a cut to know whether it adds coordinates. */
export interface Ranged {
    readonly dimension: string;
    readonly keep?: number | undefined;
    /** The cut a nested truncation ranks inside, where there is one. */
    readonly within?: string | undefined;
}
/**
 * The cuts grouped into classes that vary independently of each other.
 *
 * The number of classes is how many coordinates a request has; the classes
 * themselves are which columns cross in its domain. `held` says which edges
 * join two cuts into a class: sizing follows determination alone, since a city
 * rides along with its region, and a domain also follows a nesting, since the
 * accounts a nesting keeps depend on the region they were ranked in.
 */
export declare function classes<T extends Ranged>(cuts: readonly T[], held: (left: T, right: T) => boolean): readonly (readonly T[])[];
/**
 * The determination edge, for `classes`. A truncated cut is determined by
 * nothing: keeping its top few makes it vary on its own terms.
 */
export declare function determined<T extends Ranged>(catalog: Catalog): (left: T, right: T) => boolean;
/**
 * The cuts that range over something, which is not all of them.
 *
 * A cut determined by another in the same request rides along with it: city
 * and region make sixteen coordinates, and a request
 * split at the key makes one per row however many attributes it carries. Kept
 * in the order asked, so the cut that lands on a chart's long axis is still the
 * first one that varies.
 *
 * Read by the algebra to size a request and by the grammar to shape one, since
 * both were counting the same thing wrongly. A detail row is one axis with
 * labels on it, and a grammar counting three cuts calls it compound and refuses
 * every chart that could draw it.
 */
export declare function ranging<T extends Ranged>(catalog: Catalog, cuts: readonly T[]): readonly T[];
/** The clocks, which are the dimensions a request may put a grain on. */
export declare function clocks(catalog: Declaration<unknown>): readonly DimensionDef[];
/**
 * A declaration and its measurement, with everything derivable derived.
 *
 * The platform's column record is generated from `of`, not written
 * beside it, so a unit is declared once, as a vector, at the column.
 *
 * The maps are resolved here, against sources somebody has already measured, because this
 * is where the boundary between the authored and the measured halves is crossed and a
 * second place to cross it is a second answer to what a map points at. An empty
 * map is what `among` is checked for: a map quietly dropped is a cut that refuses, and a
 * refusal that reads as a statement about the data is the worst of both.
 */
export declare function catalogued(said: Declaration, profile: SourceProfile, among?: Readonly<Record<string, Catalog>>, quality?: Quality): Catalog;
/**
 * These declarations, with every map's target ahead of the source mapping into it.
 *
 * Which is the order they can be measured in and the only one: a catalog is built from a
 * profile and the catalogs its maps name, so a source whose target is unmeasured cannot be
 * built at all. The order is a property of the model, so
 * a page and a suite measuring in different orders is not a thing that can happen.
 *
 * `roots` is what a page has that a suite does not: one figure wants one source and what
 * that source needs, and measuring the whole model to draw it is the cost this exists to
 * avoid. Every root's targets are looked up in `model`, which is the only reason the
 * model is passed at all.
 *
 * A cycle is refused. Two sources mapping into each other cannot both
 * be built by this construction, and returning some order anyway would put the refusal at
 * whichever one lost the race.
 */
export declare function ordered(model: readonly Declaration[], roots?: readonly Declaration[]): readonly Declaration[];
export declare function measureNamed(catalog: Declaration<unknown>, name: string): MeasureDef | undefined;
