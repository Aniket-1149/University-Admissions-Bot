export const StructuredDataDisplay = ({ data }) => {
  const toArray = (value) => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  };

  return (
    <div className="space-y-4">
      {data.universityName && (
        <div className="border-b border-border/50 pb-3">
          <h3 className="text-lg font-display font-bold text-primary">{data.universityName}</h3>
        </div>
      )}

      {data.programs && data.programs.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Programs</h4>
          <div className="grid gap-2">
            {data.programs.map((program, idx) => (
              <div key={idx} className="info-card">
                <p className="font-medium text-foreground">{program.name}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {program.degree && <span className="tag tag-primary">{program.degree}</span>}
                  {program.duration && <span className="tag tag-accent">{program.duration}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.requirements && (
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Requirements</h4>
          <div className="space-y-2">
            {data.requirements.academic && (
              <div className="info-card">
                <p className="text-xs font-medium mb-2 tag-primary inline-block px-2 py-0.5 rounded-full">Academic</p>
                <ul className="space-y-1">
                  {toArray(data.requirements.academic).map((req, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start">
                      <span className="text-primary mr-2">•</span>{req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {data.requirements.testScores && (
              <div className="info-card">
                <p className="text-xs font-medium mb-2 tag-warning inline-block px-2 py-0.5 rounded-full">Test Scores</p>
                <ul className="space-y-1">
                  {toArray(data.requirements.testScores).map((score, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start">
                      <span className="text-accent mr-2">•</span>{score}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {data.requirements.documents && (
              <div className="info-card">
                <p className="text-xs font-medium mb-2 tag-accent inline-block px-2 py-0.5 rounded-full">Required Documents</p>
                <ul className="space-y-1">
                  {toArray(data.requirements.documents).map((doc, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start">
                      <span className="text-accent mr-2">•</span>{doc}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {data.deadlines && data.deadlines.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Deadlines</h4>
          <div className="info-card border-l-4 border-l-accent">
            <ul className="space-y-1">
              {data.deadlines.map((deadline, idx) => (
                <li key={idx} className="text-sm flex items-center">
                  <span className="mr-2">📅</span>{deadline}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {data.fees && (
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Fees</h4>
          <div className="info-card flex flex-wrap gap-4">
            {Object.entries(data.fees).map(([key, value], idx) => (
              <div key={idx} className="flex-1 min-w-[120px]">
                <p className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                <p className="font-semibold text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.additionalInfo && data.additionalInfo.length > 0 && (
        <div className="pt-2">
          <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
            <p className="text-xs font-semibold text-primary mb-1 flex items-center">
              <span className="mr-2">ℹ️</span> Additional Information
            </p>
            <ul className="space-y-1">
              {data.additionalInfo.map((info, idx) => (
                <li key={idx} className="text-sm text-foreground/80 flex items-start">
                  <span>{info.replace(/\*\*/g, '').replace(/^\* /, '').trim()}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
