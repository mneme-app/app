const decisionPoints = [
    {
        heading: "Corporate Affairs",
        questions: [
            {
                motion: "What will the company be named?",
                choices: ["Learning, Language, and Multicultural Advancement"],
            },
            {
                motion: "What will be the fiscal year of the company?",
                choices: ["January 1st through December 31st"],
            },
        ],
    },
    {
        heading: "Decision-Making Framework",
        questions: [
            {
                motion: "What decisions does the membership make directly?",
                choices: [
                    `- Electing the General Manager of the cooperative, who is also on the Board of Directors
- Electing the directors on the Board of Directors
- Changing the number of possible directors on Board of Directors
- Decisions that affect likely survival of cooperative
- Decisions that alter policies for inducting new members or removing members
- Decisions that alter basic character of the cooperative
- Amendment of Articles of Organization
- Amendment of Operating Agreement
- Decision to dissolve company
- Decision to sell major assets or merge with another firm`,
                ],
            },
            {
                motion: "What decisions is the Board of Directors responsible for?",
                choices: [
                    `- Defining goals of company
- Setting the Company Policy to achieve those goals
- Evaluating performance of General Manager and reporting recommendations to membership if deemed necessary
- Controlling finances of cooperative, including:
  a. Approving all budgets and financial plans
  b. Authorizing loans
  c. Decisions that commit $50,000 or more of company funds
- Appointing committees and their chairpersons
- Reassigning members of committees and chairpersons as deemed necessary
- Decisions that commit company to a course of action for one year or more`,
                ],
            },
        ],
    },
    {
        heading: "Member Eligibility",
        questions: [
            {
                motion: "Must every employee or contractor be a member?",
                choices: ["No."],
            },
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
            {
                motion: "Who decides whether or not a potential member is approved?",
                choices: [
                    "While the company has fewer than 25 members, a simple majority of members votes in a new member after the Board of Directors verifies that they meet eligibility requirements. When membership is 25 or greater, the Board of Directors appoints a Hiring Committee to verify eligibility and approve new member. The Hiring Committee is permitted to use Board of Directors for assistance in decision.",
                ],
            },
            {
                motion: "If a candidate for membership is not approved the first time, can they apply again?",
                choices: [
                    "Yes, and previous work and training will be counted towards their eligibility. The Board of Directors or Hiring Committee may, at their discretion, counsel the candidate or offer training to the candidate for proper communication, in-demand qualification/quality, or any other factor that will improve their eligibility.",
                ],
            },
            {
                motion: "What is the process for bringing in new members?",
                choices: [
                    "Resumes are sent to the company and reviewed by the Board of Directors or Hiring Committee. Company must adhere to a sound non-discrimination policy. Recruitment policy will attempt to attract a diverse population, but will not discriminate except according to eligibility requirements.",
                ],
            },
        ],
    },
    {
        heading: "Membership Shares",
        questions: [
            {
                motion: "How much does membership cost (what is the buy-in)?",
                choices: ["$500 per year"],
            },
            {
                motion: "Will the buy-in price be adjusted over time? If so, how is that decision made?",
                choices: [
                    "Any increase or decrease in buy-in must first be approved by a majority of members. The change will only be applied to each member's fee that is payable after the change is scheduled to take effect.",
                ],
            },
            {
                motion: 'For potential members where the buy-in is a financial hardship, does the co-op offer options for payment through payroll deductions or a loan program?  If so, is there a "down payment"? Is there a period by which the full buy-in fee must be purchased?',
                choices: [
                    "Full buy-in must be complete within one year of excepting membership in order to remain eligible for membership benefits. Renewal of membership for later years require that membership fees be paid for previous years. The member may elect to have some or all of membership fees deducted from earnings from contracts through the company.",
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
                    `A member may elect to terminate membership. If they are unable to pay membership fees, they will be encouraged to communicate with the Board to arrange service contracts with the company to pay for membership fees as discussed above. The Board is to make a reasonable effort to make this a palatable option, as part of our company goal is to help build member careers and maintain a diverse membership. If the member is not willing despite Board's efforts, their membership will be terminated.
                    
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
                choices: ["Yes", "What does this even mean?"],
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
                motion: "What happens to the funds in the collective reserve account on dissolution of the company?",
                choices: [
                    "Net profits after the company is dissolved will be managed in different ways depending on the reason for the dissolution. If the company is dissolved because it is restructuring to have the business operate as a cooperative corporation or because it is merging with another cooperative, then net profits are distributed to current members. If the company is dissolving because of insolvency or because all members are terminating membership, then net profit is to be donated to a nonprofit chosen by the outgoing Board of Directors.",
                    "Net profits are distributed to current members according to normal distribution and patronage distributions.",
                ],
            },
        ],
    },
    {
        heading: "Meetings of Members",
        questions: [
            {
                motion: "When is the annual meeting?",
                choices: ["On the second Monday of January at 3:00 PM GMT."],
            },
            {
                motion: "How often do you have other regular meetings?",
                choices: [
                    "The Board of Directors is required to meet at least once per quarter, but may meet more frequently.",
                    "The Board of Directors meets every Monday at 3:00 PM GMT. They may reschedule if a director has a scheduling conflict.",
                ],
            },
            {
                motion: "How must notice of meetings be given, and how far in advance?",
                choices: [
                    "At least 24 hours before the meeting.",
                    "Regular meetings should be put on the company calendar or event list well in advance (at least 10 days) and do not otherwise require notice. Special meetings for all members require 10 days notice. The company cannot reasonably send postal communications because of the wide variety of nations, so the company will establish electronic communication with members in Company Policy. If the company uses the established communication method, the member is considered informed whether or not they view the notice. The company may opt for other forms of communication, but they are not obligated to.",
                ],
            },
            {
                motion: "What is a quorum?",
                choices: [
                    `For most decisions, a quorum is a simple majority. Because of time zone differences, it is unlikely there will be a quorum present in a meeting at any one time. Company Policy will dictate exactly how members will vote on motions, including ranked choice voting as appropriate.

For decisions likely to cause insolvency in the judgment of the Board of Directors, or decision to dissolve the company, 75% of total members must vote in favor in order for the decision to pass.

For other decisions, in order for a motion to carry, a quorum must at least respond to a motion, even if some responses are abstentions. In the case of ranked choice voting, if a majority of membership responds, the choices are ranked according to the responses received. If a majority of membership responds and a majority of respondants vote in favor, the motion carries. In the case of a tie, the General Manager has the tie-breaking vote. If a motion does not carry but is not voted against by a quorum, the Board of Directors has the option to amend the motion and post it again for a vote. This only applies for regular decisions for all of membership.

Committees may set their own decision-making policies as permitted by the Board within the scope of the committees' delegated duties.

Decisions delegated to the Board of Directors require majority vote of the Directors. In the case of a tie, the General Manager has the tie-breaking vote.`,
                ],
            },
            {
                motion: "What is the process for calling a special meeting? How much notice is required? What percentage/how many members are needed to call a special meeting?",
                choices: [
                    "Special meetings for a committee does not require notice provided a quorum of the committee is available. This is to allow emergency meetings of committees like the Grievance Committee and a possible Security Committee, which handle issues that may need urgent attention to reduce liability. Special meetings for all membership requires 10 days notice. The Board decides on requests from a member to call a special meeting. If 25% or more of membership collectively petition the Board to call a special meeting on a specific topic or set of topics, the Board is obligated to schedule a special meeting no more than 30 days from the receipt of the petition with 10 days notice before the meeting.",
                ],
            },
            {
                motion: "Will the company offer remote attendance (e.g., videochat, conference call) at meetings?",
                choices: [
                    "Most if not all meetings are remote. Company Policy will dictate requirements for video and audio, but privacy of each member should be respected as much as practical. For example, do not require the member to turn on their camera if they are not comfortable and there is no practical need. Reasonable accommodations should also be made for members who do not have strong spoken English. We are, by name, multicultural and multilingual.",
                ],
            },
            {
                motion: "Will the company allow proxy voting?",
                choices: ["No."],
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
                motion: "How many board seats must be held by members? What other stakeholders may have a voice on the board and how is their voice structured?",
                choices: [
                    "All directors on Board of Directors must be members of company.",
                    "One director may be a non-member.",
                ],
            },
            {
                motion: "Will you mandate or limit participation of managers on the board?",
                choices: [
                    "The General Manager will be a director on the Board of Directors.",
                ],
            },
            {
                motion: 'Will you have an "employee coordinator"?',
                choices: [
                    "Yes, as a non-voting member of the Board.",
                    "Yes, as a voting director on the Board of Directors",
                    "With membership less than 25, the Board of Directors is responsible for making sure they are getting good member feedback. Greater than 25, one of the directors on the Board is to be appointed by the Board to be the chair of the Member Relations Committee. The Board or chair may appoint as many willing members or non-members to be in the committee as deemed appropriate. The Member Relations Committee is tasked with increasing member interaction, participation, and satisfaction and will measure the above, act to improve measures within scope given by Board, petition Board for changes that may improve measures further, and report progress. This is important for making sure members renew their membership and making the company attractive to new members.",
                ],
            },
            {
                motion: "How long is a standard term for members vs. outside directors?",
                choices: [
                    "The term for a director on the Board of Directors is 6 months. Vacancies are filled by ballots posted after quarterly meetings.",
                ],
            },
            {
                motion: "How many terms can a director serve in a row?",
                choices: [
                    "Other than a General Manager, directors may serve unlimited consecutive terms. The General Manager, however, may only serve four consecutive terms (two years).",
                    "General Manager may only serve four consecutive terms as General Manager. Other directors on Board may serve six consecutive terms (three years), after which they must leave Board for at least one term.",
                ],
            },
            {
                motion: "How do you make board decisions? (by consent, consensus, consensus minus one, majority vote?)",
                choices: [
                    "Majority vote of entire Board.",
                    "60% or more vote of entire Board.",
                ],
            },
            {
                motion: "How often are regular meetings? Are they open to everyone?",
                choices: [
                    "Every Monday and the meeting is open to all members. However, the Board must recognize a non-director before they are permitted to speak.",
                    "Quarterly meetings at least with the option for more meetings. Regular quarterly Board meetings are open to membership to listen. Non-directors and invited non-members (subject to Company Policy) may speak at the discretion of the Board of Directors.",
                ],
            },
            {
                motion: "How can notice of meetings be given? How far in advance must notice be given?",
                choices: [
                    "For Board of Directors meetings, 10 days notice is preferred, but directors may waive notice if a majority are available to attend.",
                ],
            },
            {
                motion: "How many members need to be present to vote? (i.e., what is quorum?)",
                choices: [
                    "No physical presence is required to vote. In order for a motion to pass with the Board of Directors, a majority of directors must vote in favor, with the General Manager breaking ties.",
                ],
            },
            {
                motion: "What committees will the board have?",
                choices: [
                    "The following committees are to be appointed by the Board and filled according to Company Policy: Grievance Committee, Hiring Committee, and the Member Relations Committee when membership reaches 25.",
                ],
            },
            {
                motion: "Will you have a grievance committee?",
                choices: [
                    "The Grievance Committee will be appointed by the Board but will not include the General Manager. Policies and processes for Grievance Committee will be in Company Policy. If a grievance is received by a member of the Grievance Committee and the grievance involves a memver of the Grievance Committee, that member is not permitted to be involved in the decision making for that grievance.",
                ],
            },
            {
                motion: "Will you have board officers? Which ones?  (president/chair, treasurer, secretary, etc.)",
                choices: [
                    "General Manager, Treasurer, Assistant Manager.",
                    "General Manager is the only required officer. Other roles, such as bookkeeping and record keeping, may be delegated by the Board to any director, member, or non-member provided the person is available to perform their duties for meetings of the Board or can provide a sufficient report for the meetings beforehand. The Board is responsible for maintaining good company records and thorough financial accounts.",
                ],
            },
            {
                motion: "How long will officer terms be",
                choices: [
                    "Six months.",
                    "Other than General Manager, officers may switch roles at the discretion of the Board.",
                ],
            },
            {
                motion: "How will officers be chosen?",
                choices: [
                    "Appointment by the Board in accordance with their policy.",
                    "Officers will be elected by membership.",
                ],
            },
            {
                motion: "What is the process for filling officer vacancies?",
                choices: [
                    "Board appoints from within the Board with the exception of the General Manager.",
                ],
            },
            {
                motion: "What is the process for nominating and electing co-op members to the board?",
                choices: [
                    "The Board will establish recommended training, but will not require it. In order to be eligible, a candidate should be available at least 10 days before election to receive and respond to questions and comments from members. This may be public or private messages, but no privacy is assumed by either party if the messages are regarding candidacy.",
                ],
            },
            {
                motion: "What is the process for outside experts to serve on the board of directors?",
                choices: [
                    "Non-members may be consulted by the Board, but their votes are not counted.",
                ],
            },
            {
                motion: `What is the process for removing directors?
-How is a director removed by the membership?
-How is a director removed by fellow directors?`,
                choices: [
                    "Company Policy establishes ethical behavior for all members. If a director is violating law or Company Policy, they are subject to the Grievance Committee's process same as any member, but a director on the Board of Directors is held to a higher standard than other members and a General Manager is expected to demonstrate honesty and integrity in all activity that directly involves members and the company. The Grievance Committee may terminate a director's membership or remove them from the Board of Directors according to the standards of Company Policy. The Grievance Committee may, at their discretion, post their concerns about a director who may be seeking re-election if the accused violation was an ethical or criminal violation. Private or identifying information of other parties involved should be redacted unless the other party has waived privacy.",
                ],
            },
            {
                motion: "What is the process for filling vacancies?",
                choices: [
                    "A special meeting for membership will be scheduled only if the General Manager position becomes vacant or there are less than three directors on the Board of Directors. The Board immediately appoints an acting General Manager when the General Manager position becomes vacant or the General Manager is unavailable during what is considered a crisis in Company Policy. The acting General Manager serves only until the General Manager role is filled again by election.",
                ],
            },
            {
                motion: "What level of control does the selling owner have in the business?",
                choices: ["Not applicable."],
            },
            {
                motion: "Does this control change over time or with certain criteria?",
                choices: ["Not applicable."],
            },
        ],
    },
    {
        heading: "Amendments to Operating Agreement",
        questions: [
            {
                motion: "When can directors vs. members initiate and approve changes to the bylaws?",
                choices: [
                    `The Board of Directors can propose changes to the Operating Agreement, but they must be approved by the membership.

Membership can propose changes to the Operating Agreement with a petition of 20% or more of members.

A 75% majority of members be required to amend provisions regarding the procedure to make, amend, or repeal any part of the Operating Agreement; the provisions for removal of directors; the provisions for election of directors; the terms of member eligibility; or the provision requiring the company to be a member of an association of worker-owned businesses`,
                ],
            },
            {
                motion: "Will the company automatically review certain bylaw provisions when it reaches a certain size or landmark?",
                choices: [
                    "25 members will trigger a review to Operating Agreement at the next regular meeting.",
                ],
            },
        ],
    },
    {
        heading: "Federation Membership",
        questions: [
            {
                motion: "Will you require membership in a cooperative association?",
                choices: [
                    "Yes, at the Board of Directors choosing.",
                    "Yes, the International Cooperative Alliance with other associations as added options.",
                    "At the discretion of the Board of Directors.",
                ],
            },
        ],
    },
];

export default decisionPoints;
