const decisions = [
    {
        heading: "Member Eligibility",
        questions: [
            {
                motion: "What are the requirements for membership?",
                choices: [
                    `1. 30 days or more from the start of the first contract or employment with company
2. 30 hours of work or the rough equivalent of work as determined using Company Policy
3. Appreciation of correction and guidance
4. Constructive interaction: disagrees contructively and/or contributes in positive ways
5. Recommended by members who have worked with them
6. Quality or qualification that is in demand for the company
7. No reservations about their honesty and integrity`,
                ],
            },
        ],
    },
    {
        heading: "Terminating Membership",
        questions: [
            {
                motion: "How is membership terminated?",
                choices: [
                    "The member can either withdraw from the membership or get voted out.  If a member suspected of a malicious activity, a report can be filled against them under the grievance committee. The committee would then publish a report and open a ballot for voting in support or against the report.",
                    `A member may elect to terminate membership. If they are unable to pay membership fees, they will be encouraged to communicate with the Board for possible assistance or work contracts for which the member is qualified.

Company Policy will establish professional standards, ethics, and rules. Violations of this policy generally will not result in termination. Egregious violations, illegal activity, and repeated violations of an ethical nature will be reviewed by the Grievance Committee and may result in termination of membership in accordance with Company Policy.`,
                ],
            },
        ],
    },
    {
        heading: "Internal Capital Account System",
        questions: [
            {
                motion: "Will you have a collective account?",
                choices: [
                    "The Board of Directors will decide this from year to year",
                    "20% is allocated to the collective account in the first year, but this will change at the discretion of the Board of Directors.",
                ],
            },
            {
                motion: "Is there a set minimum percentage of net income that will be allocated to the collective account? Or does the board decide on a year-to-year basis?",
                choices: [
                    "The Board of Directors will decide this from year to year",
                    "20% is allocated to the collective account in the first year, but this will change at the discretion of the Board of Directors.",
                    "What does this even mean?",
                ],
            },
            {
                motion: "What is the basis for patronage distributions?",
                choices: [
                    "The Board of Directors will calculate patronage distributions based on a rational and fair assessment of each current member's contribution to the overall value of the company that has resulted in net profit. This may include, at the Board's discretion, considering the number of contracts and projects a member has participated in, the amount of hours or equivalent hours, as well as contributions of various valuable forms made while they were members in good standing that tangibly benefit the company during the time they are members in good standing. For aforementioned contributions, the Board may consider artwork, writing, code, and similar tangible works, including work that is open source or otherwise freely available. The methodology for calculating patronage is at the Board's discretion, may be amended at the Board's discretion any time, and is subject to review and comment by all members at their request if not posted for all members.",
                ],
            },
            {
                motion: "How are internal capital accounts paid out to members?",
                choices: [
                    "Payments are deferred if cash is insufficient. The Board of Directors is responsible for scheduling distributions from capital accounts. They must make a reasonable effort to distribute in such a way that members are at least able to meet their tax obligations for taxable income from the company.",
                ],
            },
            {
                motion: "How will the balance in the individual capital account be distributed upon termination of membership?",
                choices: [
                    "Remaining capital account is regarded as debt owed by the company at 0% interest. It is paid back as funds are available at the discretion of the Board of Directors within five years. If the company does not have funds to pay the debt in five years, they are to negotiate a promissory note from the company with the former member or their estate or beneficiary on file with the company.",
                ],
            },
            {
                motion: "What happens to the funds in the collective reserve account on dissolution of the company?",
                choices: [
                    "Net profits after the company is dissolved will be managed in different ways depending on the reason for the dissolution. If the company is dissolved because it is restructuring to have the business operate as a cooperative corporation or because it is merging with another cooperative, then net profits are distributed to current members. If the company is dissolving because of insolvency or because all members are terminating membership, then net profit is to be donated to a nonprofit chosen by the outgoing Board of Directors.",
                    "Net profits are distributed to current members according to normal distribution and patronage distributions.",
                ],
            },
        ],
    },
    {
        heading: "Board of Directors",
        questions: [
            {
                motion: "What is the range in the number of board members that the company must maintain?",
                choices: [
                    "At least five members.",
                    "3, 5 or 7 depending on the size of membership. The Board of Directors should be at least 3, no more than 7, and otherwise less than half of the total membership. Thus it is only up to 5 directors when there are 11 members or more and only 7 directors when there are 15 or more members. However, a special meeting is only called to fill vacancies in the Board if there are less than 3 directors. Otherwise, the vacancies are filled from willing nominees during the regular election. If there are not enough willing nominees to fill all vacancies, it is fine provided there are at least 3 directors.",
                ],
            },
            {
                motion: "How many terms can a director serve in a row?",
                choices: [
                    "Other than a General Manager, directors may serve unlimited consecutive terms. The General Manager, however, may only serve four consecutive terms (two years).",
                    "General Manager may only serve four consecutive terms as General Manager. Other directors on Board may serve six consecutive terms (three years), after which they must leave Board for at least one term.",
                ],
            },
        ],
    },
];

export default decisions;
