export const RULES: string = `@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix log:  <http://www.w3.org/2000/10/swap/log#> .
@prefix :     <http://example.org/conflict#> .

{
    ?prohibition a odrl:Prohibition ;
        odrl:target   ?target ;
        odrl:assignee ?assignee ;
        odrl:action   ?action .

    ?duty a odrl:Duty ;
        odrl:target   ?target ;
        odrl:assignee ?assignee ;
        odrl:action   ?action .
  
# generate a skolem IRI based on the duty
    (?duty ?prohibition) log:skolem ?conflict .

}
=>
{
    ?conflict
        a :Conflict ;
        :conflict
        "This duty can never be fulfilled because the same assignee is prohibited from performing the same action on the same target." .
}.`;