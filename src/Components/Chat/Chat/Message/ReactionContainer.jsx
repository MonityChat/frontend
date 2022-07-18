import React from 'react';

export default function ReactionContainer({reactions}) {
    
	return (
		<div className="reaction-container">
			{reactions?.map((reaction, i) => (
				<div className="reaction" key={i}>
					{toEmoji(reaction.reaction)}
					{reaction.count > 1 && (
						<span className="count">{reaction.count}</span>
					)}
				</div>
			))}
		</div>
	);
}

/**
 * Converts a codePoint String into an emoji
 * @param {String} codePoint A emoji in CodePoint format 
 * @returns {String} the emoji
 */
function toEmoji(codePoint){
    return String.fromCodePoint('0x' + codePoint);
}